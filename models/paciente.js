// backend/models/paciente.js
import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  contato: {
    telefone: {
      type: String,
      required: true
    },
    email: String
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  historico: {
    type: String,
    default: ''
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Paciente', pacienteSchema);
