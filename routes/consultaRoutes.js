import express from 'express';
import {
    criarConsulta,
    cancelarConsulta,
    deletarConsulta,
    atualizarConsulta,
    listarConsultas,
    buscarConsultaPorId
} from '../controllers/consultaController.js';

const router = express.Router();

router.route('/')
    .get(listarConsultas)
    .post(criarConsulta);

router.route('/:id')
    .get(buscarConsultaPorId)
    .put(atualizarConsulta)
    .delete(deletarConsulta);

router.route('/:id/cancelar')
    .put(cancelarConsulta);

export default router;
