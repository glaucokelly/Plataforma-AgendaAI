// backend/controllers/chatController.js
import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const conversarComGemma = async (req, res) => {
  console.log("↪️ [chatController] Chegou requisição com:", req.body);
  console.log(
    "↪️ [chatController] GEMINI_API_KEY =",
    GEMINI_API_KEY ? "OK" : "NÃO DEFINIDA"
  );

  try {
    const { contexto } = req.body;
    if (!Array.isArray(contexto) || contexto.length === 0) {
      return res.status(400).json({
        mensagem: "Campo 'contexto' ausente ou inválido. Deve ser um array de interações."
      });
    }

    // Não injetamos nenhum outro systemPrompt aqui (já vem do frontend)
    const mensagens = [...contexto];

    // Mapeia cada mensagem para a chave `parts`, SEM prefixos de “Usuário” ou “Bot”
    const parts = mensagens.map((msg) => {
      return { text: msg.texto };
    });

    const payload = {
      contents: [
        {
          parts: parts
        }
      ]
    };

    // Força uso de IPv4 ao chamar a Gemini (evita EHOSTUNREACH em IPv6)
    const ipv4Agent = new https.Agent({ family: 4 });

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        httpsAgent: ipv4Agent
      }
    );

    const candidato = response.data.candidates?.[0];
    if (!candidato) {
      console.error("[chatController] Sem candidatos na resposta:", response.data);
      return res.status(500).json({ mensagem: "Resposta inválida do Gemini Flash." });
    }

    const textoResposta =
      candidato.content.parts?.[0]?.text || "🤖 ...sem texto...";
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
    return res.status(500).json({
      mensagem: "Erro interno no servidor.",
      detalhes: error.message
    });
  }
};

export { conversarComGemma };
