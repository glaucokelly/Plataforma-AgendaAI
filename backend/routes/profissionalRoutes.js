import express from 'express';
import {
    criarProfissional,
    listarProfissionais,
    buscarProfissional,
    atualizarProfissional,
    deletarProfissional
} from '../controllers/profissionalController.js';

const router = express.Router();

router.route('/')
    .get(listarProfissionais)
    .post(criarProfissional);

router.route('/:id')
    .get(buscarProfissional)
    .put(atualizarProfissional)
    .delete(deletarProfissional);

export default router;
