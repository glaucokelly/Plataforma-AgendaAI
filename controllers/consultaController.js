// backend/controllers/consultaController.js
import Consulta from '../models/consulta.js';
import Paciente from '../models/paciente.js';
import Profissional from '../models/profissional.js'; // IMPORTADO CORRETAMENTE

// Criar consulta
const criarConsulta = async (req, res) => {
  try {
    const { paciente, profissional, data, horario, duracao, observacoes } = req.body;

    // 1) Verificar paciente
    const pacienteExistente = await Paciente.findById(paciente);
    if (!pacienteExistente) {
      return res.status(400).json({ mensagem: 'Paciente não encontrado.' });
    }

    // 2) Verificar profissional
    const profissionalExistente = await Profissional.findById(profissional);
    if (!profissionalExistente) {
      return res.status(400).json({ mensagem: 'Profissional não encontrado.' });
    }

    // 3) Conferir conflito de horário (somente profissional)
    const consultaExistente = await Consulta.findOne({
      profissional,
      data: new Date(data),
      horario,
      status: { $ne: 'Cancelada' } // Deve bater com o enum (maiúsculo)
    });
    if (consultaExistente) {
      return res.status(400).json({
        mensagem: 'Já existe uma consulta agendada para esse profissional nesse dia e horário.'
      });
    }

    // 4) Criar a nova consulta
    const novaConsulta = new Consulta({
      paciente,
      profissional,
      data: new Date(data),
      horario,
      duracao: duracao || 30,
      observacoes: observacoes || ''
    });
    const consultaSalva = await novaConsulta.save();

    // 5) Popula detalhes de paciente/profissional
    const consultaComDetalhes = await Consulta.findById(consultaSalva._id)
      .populate('paciente', 'nome')
      .populate('profissional', 'nome especialidade');

    return res.status(201).json(consultaComDetalhes);
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar consulta.' });
  }
};

// Cancelar consulta
const cancelarConsulta = async (req, res) => {
  try {
    const consulta = await Consulta.findById(req.params.id);
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }
    consulta.status = 'Cancelada'; // Ajustado para bater com enum
    await consulta.save();
    return res.status(200).json({ mensagem: 'Consulta cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar consulta:', error);
    return res.status(500).json({ mensagem: 'Erro ao cancelar consulta.' });
  }
};

// Deletar consulta
const deletarConsulta = async (req, res) => {
  try {
    const consulta = await Consulta.findByIdAndDelete(req.params.id);
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }
    return res.status(200).json({ mensagem: 'Consulta deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar consulta:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensagem: 'ID de consulta inválido.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao deletar consulta.' });
  }
};

// Atualizar consulta
const atualizarConsulta = async (req, res) => {
  try {
    const { paciente, profissional, data, horario, duracao, status, observacoes } = req.body;

    const consulta = await Consulta.findById(req.params.id);
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }

    // 1) Validar paciente, se mudou
    if (paciente && paciente !== consulta.paciente.toString()) {
      const pacienteExistente = await Paciente.findById(paciente);
      if (!pacienteExistente) {
        return res.status(400).json({ mensagem: 'Paciente não encontrado.' });
      }
    }

    // 2) Validar profissional, se mudou
    if (profissional && profissional !== consulta.profissional.toString()) {
      const profissionalExistente = await Profissional.findById(profissional);
      if (!profissionalExistente) {
        return res.status(400).json({ mensagem: 'Profissional não encontrado.' });
      }
    }

    // 3) Checar conflito de horário (se data ou horário mudaram)
    let novaHora = consulta.horario;
    let novaData = consulta.data.toISOString().split('T')[0];

    if ((data && data !== consulta.data.toISOString().split('T')[0]) ||
        (horario && horario !== consulta.horario)) {
      const profissionalID = profissional || consulta.profissional;
      novaData = data || consulta.data.toISOString().split('T')[0];
      novaHora = horario || consulta.horario;

      const consultaExistente = await Consulta.findOne({
        _id: { $ne: req.params.id },
        profissional: profissionalID,
        data: new Date(novaData),
        horario: novaHora,                  // Usa a variável correta
        status: { $ne: 'Cancelada' }         // Bate com enum
      });

      if (consultaExistente) {
        return res.status(400).json({
          mensagem: 'Já existe uma consulta agendada para esse profissional nesse dia e horário.'
        });
      }
    }

    // 4) Atualiza a consulta
    const consultaAtualizada = await Consulta.findByIdAndUpdate(
      req.params.id,
      {
        paciente: paciente || consulta.paciente,
        profissional: profissional || consulta.profissional,
        data: data ? new Date(data) : consulta.data,
        horario: novaHora,
        duracao: duracao || consulta.duracao,
        status: status || consulta.status,
        observacoes: observacoes !== undefined ? observacoes : consulta.observacoes
      },
      { new: true, runValidators: true }
    )
    .populate('paciente', 'nome')
    .populate('profissional', 'nome especialidade');

    return res.status(200).json(consultaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar consulta.' });
  }
};

// Listar consultas
const listarConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.find()
      .populate('paciente', 'nome')
      .populate('profissional', 'nome especialidade')
      .sort({ data: 1 });

    return res.status(200).json(consultas);
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar consultas.' });
  }
};

// Buscar consulta por ID
const buscarConsultaPorId = async (req, res) => {
  try {
    const consulta = await Consulta.findById(req.params.id)
      .populate('paciente', 'nome cpf contato')
      .populate('profissional', 'nome especialidade');

    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }
    return res.status(200).json(consulta);
  } catch (error) {
    console.error('Erro ao buscar consulta por ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensagem: 'ID de consulta inválido.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao buscar consulta.' });
  }
};

export {
  criarConsulta,
  cancelarConsulta,
  deletarConsulta,
  atualizarConsulta,
  listarConsultas,
  buscarConsultaPorId
};
