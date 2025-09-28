// backend/controllers/chatController.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const conversarComGemma = async (req, res) => {
  console.log("↪️ [chatController] Chegou requisição com:", req.body);
  console.log("↪️ [chatController] GEMINI_API_KEY =", GEMINI_API_KEY ? "OK" : "NÃO DEFINIDA");

  try {
    const { mensagem } = req.body;
    if (!mensagem) {
      return res.status(400).json({ mensagem: "Campo 'mensagem' ausente." });
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: mensagem }
          ]
        }
      ]
    };

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      payload
    );

    const candidato = response.data.candidates?.[0];
    if (!candidato) {
      console.error("[chatController] Sem candidatos na resposta:", response.data);
      return res.status(500).json({ mensagem: "Resposta inválida do Gemini Flash." });
    }
    const textoResposta = candidato.content.parts?.[0]?.text || "🤖 ...sem texto...";
    console.log("[chatController] Gemini respondeu:", textoResposta);

    return res.json({ resposta: textoResposta });
  } catch (error) {
    if (error.response) {
      console.error("[chatController] Erro da API Gemini:", error.response.data);
      return res.status(500).json({
        mensagem: "Erro ao conversar com Gemini (API)",
        detalhes: error.response.data
      });
    }
    console.error("[chatController] Erro genérico:", error.message);
    return res.status(500).json({ mensagem: "Erro interno no servidor.", detalhes: error.message });
  }
};

export { conversarComGemma };
