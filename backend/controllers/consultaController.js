import Consulta from '../models/consulta.js';
import Paciente from '../models/paciente.js';

//Criar consulta
const criarConsulta = async (req, res) => {
    try {
        const { paciente, profissional, data, horario, duracao, observacoes } = req.body;

        const pacienteExistente = await Paciente.findById(paciente);
        if (!pacienteExistente) {
            return res.status(400).json({ mensagem: 'Paciente não encontrado.' });
        }

        const profissionalExistente = await Profissional.findById(profissional);
        if (!profissionalExistente) {
            return res.status(400).json({ mensagem: 'Profissional não encontrado.' });
        }

        const constultaExistente = await Consulta.findOne({
            profissional,
            data: new Date(data),
            horario,
            status: { $ne: 'cancelada'}
        });

        if (constultaExistente) {
            return res.status(400).json({ mensagem: 'Já existe uma consulta agendada para esse profissional nesse dia e horário.' });
        }

        const novaConsulta = new Consulta({
            paciente,
            profissional,
            data: new Date(data),
            horario,
            duracao: duracao || 30,
            observacoes: observacoes || ''
            
        });

        const consultaSalva = await novaConsulta.save();

        const consultaComDetalhes = await Consulta.findById(consultaSalva._id)
            .populate('paciente', 'nome')
            .populate('profissional', 'nome especialidade');

        res.status(201).json(consultaComDetalhes);

    } catch (error) {
        console.error('Erro ao criar consulta:', error);
        return res.status(500).json({ mensagem: 'Erro ao criar consulta.' });
    }
};

//Cancelar consulta
const cancelarConsulta = async (req, res) => {
    try {
        const consulta = await Consulta.findById(req.params.id);

        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
        }

        consulta.status = 'cancelada';
        await consulta.save();

        res.status(200).json({ mensagem: 'Consulta cancelada com sucesso.' });
    } catch (error){
        console.error('Erro ao cancelar consulta:', error);
        return res.status(500).json({ mensagem: 'Erro ao cancelar consulta.' });
    }
};

//Deletar consulta
const deletarConsulta = async (req, res) => {
    try {
        const consulta = await Consulta.findByIdAndDelete(req.params.id);

        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
        }

        res.status(200).json({ mensagem: 'Consulta deletada com sucesso.' });

    }catch (error) {
        console.error('Erro ao deletar consulta:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ mensagem: 'ID de consulta inválido.' });
        }
        return res.status(500).json({ mensagem: 'Erro ao deletar consulta.' });
    }
};

//Atualizar consulta
const atualizarConsulta = async (req, res) => {
    try {
        const { paciente, profissional, data, horario, duracao, status, observacoes } = req.body;

        const consulta = await Consulta.findById(req.params.id);
        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
        }

        if(paciente && paciente !== consulta.paciente.toString()){
            const pacienteExistente = await Paciente.findById(paciente);
             if (!pacienteExistente) {
                return res.status(400).json({ mensagem: 'Paciente não encontrado.' });
            }
        }

        if (profissional && profissional !== consulta.profissional.toString()) {
            const profissionalExistente = await Profissional.findById(profissional);
            if (!profissionalExistente) {
                return res.status(400).json({ mensagem: 'Profissional não encontrado.' });
            }
        }

        if((data && data !== consulta.data.toISOString().split('T')[0]) || 
        (horario && horario !== consulta.horario)) {
            const profissinoalID = profissional || consulta.profissional;
            const novaData = data || consulta.data.toISOString().split('T')[0];
            const novaHora = horario || consulta.horario;

            const constultaExistente = await Consulta.findOne({
                _id: { $ne: req.params.id },
                profissional: profissinoalID,
                data: new Date(novaData),
                horario: novoHorario,
                status: { $ne: 'cancelada' }
            });

            if (constultaExistente) {
                return res.status(400).json({ mensagem: 'Já existe uma consulta agendada para esse profissional nesse dia e horário.' }); 
            }
        }

        const consultaAtualizada = await Consulta.findByIdAndUpdate(
            req.params.id,
            {
                paciente: paciente || consulta.paciente,
                profissional: profissional || consulta.profissional,
                data: data || consulta.data,
                horario: novaHora,
                duracao: duracao || consulta.duracao,
                status: status || consulta.status,
                observacoes: observacoes !== undefined ? observacoes : consulta.observacoes
            },
            { new: true, runValidators: true }
        ).populate('paciente', 'nome')
        .populate('profissional', 'nome especialidade');

        res.status(200).json(consultaAtualizada);

    }catch (error) {
        console.error('Erro ao atualizar consulta:', error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar consulta.' });
    }
};

//Listar consultas
const listarConsultas = async (req, res) => {
    try {
        const consultas = await Consulta.find()
            .populate('paciente', 'nome')
            .populate('profissional', 'nome especialidade')
            .sort({ data: 1});

        res.status(200).json(consultas);
    } catch (error) {
        console.error('Erro ao listar consultas:', error);
        return res.status(500).json({ mensagem: 'Erro ao listar consultas.' });
    }
};

//Buscar consulta por ID
const buscarConsultaPorId = async (req, res) => {
    try {
        const consulta = await Consulta.findById(req.params.id)
            .populate('paciente', 'nome  cpf contato')
            .populate('profissional', 'nome especialidade');

        if (!consulta) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
        }

        res.status(200).json(consulta);
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