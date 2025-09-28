// backend/models/consulta.js
import mongoose from 'mongoose';

const consultaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  profissional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  duracao: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Agendada', 'Confirmada', 'Cancelada', 'Realizada'],
    default: 'Agendada'
  },
  observacoes: {
    type: String,
    default: ''
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

consultaSchema.index(
  { profissional: 1, data: 1, horario: 1 },
  { unique: true }
);


export default mongoose.model('Consulta', consultaSchema);
