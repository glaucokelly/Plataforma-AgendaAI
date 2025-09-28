import express from 'express';
import {
    criarPaciente,
    listarPacientes,
    buscarPaciente,
    atualizarPaciente,
    deletarPaciente
} from '../controllers/pacienteController.js';

const router = express.Router();

// Definindo as rotas para os pacientes
router.route('/')
    .get(listarPacientes)
    .post(criarPaciente);

router.route('/:id')
    .get(buscarPaciente)
    .put(atualizarPaciente)
    .delete(deletarPaciente);

// Exportando o router para ser utilizado em outros arquivos
export default router;
