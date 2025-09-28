import mongoose from "mongoose";

const profissionalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    especialidade: {
        type: String,
        required: true
    },
    crm: {
        type: String,
        required: true,
        unique: true
    },
    contato: {
        telefone: {
            type: String,
            required: true
        },
        email: String
    },
    diasAtendimento: [{
        diaSemana: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3, 4, 5, 6] // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        },
        horaInicio: {
            type: String,
            required: true
        },
        horaFim: {
            type: String,
            required: true
        }
    }],
    dataCadastro: {
        dataCadastro: {
            type: Date,
            default: Date.now
        }
    }
});

export default mongoose.model('Profissional', profissionalSchema);
