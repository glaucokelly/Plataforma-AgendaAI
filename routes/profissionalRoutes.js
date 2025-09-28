// backend/routes/profissionalRoutes.js
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
  .get(listarProfissionais)  // aceita query params ?crm=xxx ou ?nome=xxx
  .post(criarProfissional);

router.route('/:id')
  .get(buscarProfissional)
  .put(atualizarProfissional)
  .delete(deletarProfissional);

export default router;
