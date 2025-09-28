import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conectarAoBanco = async () => { 
    try {
        const cone = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Conectado ao MongoDB: ${cone.connection.host} com sucesso!`);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

export default conectarAoBanco;