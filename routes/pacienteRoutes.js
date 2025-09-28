// backend/routes/pacienteRoutes.js
import express from 'express';
import {
  criarPaciente,
  listarPacientes,
  buscarPaciente,
  atualizarPaciente,
  deletarPaciente
} from '../controllers/pacienteController.js';

const router = express.Router();

router.route('/')
  .get(listarPacientes)   // agora aceita query params ?cpf=xxx ou ?nome=xxx
  .post(criarPaciente);

router.route('/:id')
  .get(buscarPaciente)
  .put(atualizarPaciente)
  .delete(deletarPaciente);

export default router;
