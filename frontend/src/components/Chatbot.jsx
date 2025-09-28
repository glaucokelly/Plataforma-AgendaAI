import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState([]); // { autor: 'user' | 'bot', texto: string }
  const chatEndRef = useRef(null);

  // Scroll automático pra última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversas]);

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;
    // Adiciona mensagem do usuário à tela
    setConversas(prev => [...prev, { autor: 'user', texto: mensagem }]);
    const textoEnviado = mensagem;
    setMensagem('');

    try {
      // Chama o backend
      const res = await axios.post('http://localhost:5000/api/chat', {
        mensagem: textoEnviado,
      });

      const respostaBot = res.data.resposta || '...';

      // Adiciona resposta do bot à tela
      setConversas(prev => [...prev, { autor: 'bot', texto: respostaBot }]);
    } catch (err) {
      console.error('Erro no fetch do bot:', err);
      setConversas(prev => [...prev, { autor: 'bot', texto: 'Ocorreu um erro. Tenta de novo.' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4 flex flex-col h-[500px]">
      <div className="flex-grow overflow-auto mb-4">
        {conversas.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.autor === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`${
                msg.autor === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              } rounded-lg px-3 py-2 max-w-[70%]`}
            >
              {msg.texto}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <textarea
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none resize-none"
          rows={1}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreve aí..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-r-lg"
          onClick={enviarMensagem}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}