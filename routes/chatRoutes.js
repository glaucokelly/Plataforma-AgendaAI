import express from 'express';
import { conversarComGemma } from '../controllers/chatController.js';

const router = express.Router();
router.post('/', conversarComGemma);

export default router;
