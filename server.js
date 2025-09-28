// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conectarAoBanco from './config/dbConfig.js';

dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:3000', // ajuste para a URL/porta do seu frontend
    credentials: true
  })
);
app.use(express.json());

// Conectar ao banco de dados MongoDB
try {
  await conectarAoBanco();
  console.log('Conectado ao MongoDB com sucesso!');
} catch (error) {
  console.error('Falha na conexão com o MongoDB:', error.message);
  process.exit(1);
}

// Rotas
import consultaRoutes from './routes/consultaRoutes.js';
import profissionalRoutes from './routes/profissionalRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

app.use('/api/consultas', consultaRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Bem-vindo à API!!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
