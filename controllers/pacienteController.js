// backend/controllers/pacienteController.js
import Paciente from '../models/paciente.js';

// Criar um novo paciente
const criarPaciente = async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, contato, endereco, historico } = req.body;

    const pacienteExistente = await Paciente.findOne({ cpf });
    if (pacienteExistente) {
      return res.status(400).json({ mensagem: 'Paciente já cadastrado com esse CPF.' });
    }

    const novoPaciente = new Paciente({
      nome,
      cpf,
      dataNascimento,
      contato,
      endereco,
      historico
    });

    const pacienteSalvo = await novoPaciente.save();
    return res.status(201).json(pacienteSalvo);
  } catch (error) {
    console.error('Erro ao criar o paciente:', error);
    return res.status(500).json({
      mensagem: 'Erro ao criar o paciente',
      erro: error.message
    });
  }
};

// Deletar um paciente
const deletarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);

    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }

    return res.json({ mensagem: 'Paciente deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar o paciente:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao deletar o paciente' });
  }
};

// Atualizar um paciente
const atualizarPaciente = async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, contato, endereco, historico } = req.body;

    if (cpf) {
      const pacienteExistente = await Paciente.findOne({ cpf, _id: { $ne: req.params.id } });
      if (pacienteExistente) {
        return res.status(400).json({ mensagem: 'Este CPF já está cadastrado para outro paciente' });
      }
    }

    const pacienteAtualizado = await Paciente.findByIdAndUpdate(
      req.params.id,
      { nome, cpf, dataNascimento, contato, endereco, historico },
      { new: true, runValidators: true }
    );

    if (!pacienteAtualizado) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }

    return res.json(pacienteAtualizado);

  } catch (error) {
    console.error('Erro ao atualizar o paciente:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }
    return res.status(500).json({ mensagem: 'Erro ao atualizar o paciente' });
  }
};

// Listar todos os pacientes (ou filtrar por cpf/nome)
const listarPacientes = async (req, res) => {
  try {
    const { cpf, nome } = req.query;
    let filtro = {};

    if (cpf) {
      filtro.cpf = cpf;
    } else if (nome) {
      // pesquisa case-insensitive pelo nome
      filtro.nome = { $regex: new RegExp(nome, 'i') };
    }

    const pacientes = await Paciente.find(filtro).sort({ nome: 1 });
    return res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar os pacientes:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar os pacientes' });
  }
};

// Buscar um paciente por ID
const buscarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);

    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }

    return res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar o paciente:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }
    return res.status(500).json({ mensagem: 'Erro ao buscar o paciente' });
  }
};

export {
  criarPaciente,
  deletarPaciente,
  atualizarPaciente,
  listarPacientes,
  buscarPaciente
};
