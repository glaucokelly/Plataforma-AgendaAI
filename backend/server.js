import express from 'express'; // Importa o express para criar o servidor
import cors from 'cors'; // Importa o cors para permitir requisições de diferentes origens
import dotenv from 'dotenv'; // Importa o dotenv para carregar .env
import conectarAoBanco from "./config/dbConfig.js"; // Importa a função de conexão com o BD

dotenv.config(); // carregar as variáveis de ambiente .env
const app = express(); // criar uma instância do express

//Middlewares
app.use(cors()); 
app.use(express.json()); // Permite o envio de dados em formato JSON no corpo da requisição

// Conectar ao banco de dados MongoDB
try {
  await conectarAoBanco();
  console.log('Conectado ao MongoDB com sucesso!');
} catch (error) {
  console.error('Falha na conexão com o MongoDB:', error.message);
  process.exit(1); // Encerra o servidor se não conectar ao banco
}


// Rotas
import consultaRoutes from './routes/consultaRoutes.js'; // Importa as rotas de consulta
import profissionalRoutes from './routes/profissionalRoutes.js'; // Importa as rotas de profissional
import pacienteRoutes from './routes/pacienteRoutes.js'; // Importa as rotas de paciente
import chatRoutes from './routes/chatRoutes.js';


app.use('/api/consultas', consultaRoutes); // Define a rota base para consultas
app.use('/api/profissionais', profissionalRoutes); // Define a rota base para profissionais
app.use('/api/pacientes', pacienteRoutes); // Define a rota base para pacientes
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Bem-vindo à API!!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000; // Define a porta do servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor e exibe a mensagem no console

console.log("Olá Mundo!!!");