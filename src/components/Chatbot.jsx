// frontend/src/components/Chatbot.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chatbot({ onAgendamentoConcluido }) {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState([]);
  const [contexto, setContexto] = useState([
    {
      autor: 'system',
      texto:
        'Você é um assistente de uma clínica odontológica. NÃO repita perguntas ou respostas anteriores. ' +
        'Quando o usuário disser algo como "quero cadastrar um paciente", ou "cadastrar paciente", interprete como a escolha 1. ' +
        'Quando disser "cadastrar profissional" ou similar, interprete como escolha 2. ' +
        'Quando disser "agendar consulta" ou similar, interprete como escolha 3. ' +
        'A partir daí, siga o seguinte fluxo:\n\n' +
        '1) Se a escolha for cadastrar paciente, pergunte sequencialmente: ' +
        '"Qual o nome do paciente?", "Qual o CPF do paciente?", "Qual a data de nascimento do paciente? (YYYY-MM-DD)", ' +
        '"Qual o telefone do paciente?", "Qual o email do paciente?", "Qual a rua do paciente?", "Qual o número da residência do paciente?", ' +
        '"Qual o complemento da residência do paciente?", "Qual o bairro do paciente?", "Qual a cidade do paciente?", ' +
        '"Qual o estado do paciente?", "Qual o CEP do paciente?"\n' +
        'Quando tiver TODOS os dados acima, responda somente com JSON no formato:\n' +
        '{\n' +
        '  "acao": "cadastrar_paciente",\n' +
        '  "dados": {\n' +
        '    "nome": "...",\n' +
        '    "cpf": "...",\n' +
        '    "dataNascimento": "YYYY-MM-DD",\n' +
        '    "contato": { "telefone": "...", "email": "..." },\n' +
        '    "endereco": { "rua": "...", "numero": "...", "complemento": "...", "bairro": "...", "cidade": "...", "estado": "...", "cep": "..." },\n' +
        '    "historico": ""\n' +
        '  }\n' +
        '}\n\n' +
        '2) Se a escolha for cadastrar profissional, pergunte sequencialmente: ' +
        '"Qual o nome do profissional?", "Qual a especialidade?", "Qual o CRM?", "Qual o telefone do profissional?", ' +
        '"Qual o email do profissional?", "Quais dias de atendimento? (formato: diaSemana,HH:mm-HH:mm; ex: 1,08:00-17:00)" ' +
        '(se vários, pergunte repetidamente até o usuário indicar que terminou). ' +
        'Quando tiver TODOS os dados, responda apenas com JSON:\n' +
        '{\n' +
        '  "acao": "cadastrar_profissional",\n' +
        '  "dados": {\n' +
        '    "nome": "...",\n' +
        '    "especialidade": "...",\n' +
        '    "crm": "...",\n' +
        '    "contato": { "telefone": "...", "email": "..." },\n' +
        '    "diasAtendimento": [ { "diaSemana": 1, "horaInicio": "08:00", "horaFim": "17:00" }, ... ]\n' +
        '  }\n' +
        '}\n\n' +
        '3) Se a escolha for agendar consulta, pergunte: ' +
        '"Qual o CPF ou nome do paciente?" — quando obtiver, faça GET /api/pacientes?cpf=<cpf> ou ?nome=<nome>; ' +
        'se não encontrar, pergunte "Paciente não encontrado, deseja cadastrar novo? (sim/não)". Se sim, volte ao fluxo 1. ' +
        'Depois pergunte "Qual o CRM ou nome do profissional?" — faça GET /api/profissionais?crm=<crm> ou ?nome=<nome>; ' +
        'se não encontrar, pergunte "Profissional não encontrado, deseja cadastrar novo? (sim/não)". Se sim, volte ao fluxo 2. ' +
        'Então pergunte "Qual a data? (YYYY-MM-DD)" e "Qual o horário? (HH:mm)" e "Alguma observação?". ' +
        'Quando tiver todos os dados (idPaciente, idProfissional, data, horario, observacoes), responda somente com JSON:\n' +
        '{\n' +
        '  "acao": "agendar_consulta",\n' +
        '  "idPaciente": "...",\n' +
        '  "idProfissional": "...",\n' +
        '  "data": "YYYY-MM-DD",\n' +
        '  "horario": "HH:mm",\n' +
        '  "observacoes": "..."\n' +
        '}\n\n' +
        'Se em qualquer ponto faltar algum campo, pergunte apenas por esse campo.'
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversas]);

  const enviarMensagem = async () => {
    const textoUsuarioOriginal = mensagem.trim();
    if (!textoUsuarioOriginal) return;

    const textoUsuario = textoUsuarioOriginal.toLowerCase();

    // 1) Adiciona a mensagem do usuário à conversa/contexto
    const novaInteracao = { autor: 'user', texto: textoUsuarioOriginal };
    setConversas((prev) => [...prev, novaInteracao]);
    setContexto((prev) => [...prev, novaInteracao]);
    setMensagem('');

    // 2) INTERCEPTAÇÃO: “listar/conte quantos” sem passar pela IA
    if (textoUsuario.includes('pacientes')) {
      try {
        const resPacientes = await axios.get('http://localhost:5000/api/pacientes');
        const listaNomes = resPacientes.data
          .map((p) => p.nome)
          .join(', ')
          .trim() || 'Nenhum paciente encontrado.';
        const textoResposta = `Pacientes cadastrados: ${listaNomes}`;
        const botMsg = { autor: 'bot', texto: textoResposta };
        setConversas((prev) => [...prev, botMsg]);
        setContexto((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error('↪️ [Chatbot.jsx] Erro ao buscar pacientes:', err.message);
        const textoResposta = 'Desculpe, não consegui buscar a lista de pacientes.';
        const botMsg = { autor: 'bot', texto: textoResposta };
        setConversas((prev) => [...prev, botMsg]);
        setContexto((prev) => [...prev, botMsg]);
      }
      return;
    }

    if (textoUsuario.includes('profissionais')) {
      try {
        const resProfissionais = await axios.get('http://localhost:5000/api/profissionais');
        const listaNomes = resProfissionais.data
          .map((p) => p.nome)
          .join(', ')
          .trim() || 'Nenhum profissional encontrado.';
        const textoResposta = `Profissionais cadastrados: ${listaNomes}`;
        const botMsg = { autor: 'bot', texto: textoResposta };
        setConversas((prev) => [...prev, botMsg]);
        setContexto((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error('↪️ [Chatbot.jsx] Erro ao buscar profissionais:', err.message);
        const textoResposta = 'Desculpe, não consegui buscar a lista de profissionais.';
        const botMsg = { autor: 'bot', texto: textoResposta };
        setConversas((prev) => [...prev, botMsg]);
        setContexto((prev) => [...prev, botMsg]);
      }
      return;
    }

    // 3) Caso contrário, manda tudo para a IA
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        contexto: [...contexto, novaInteracao]
      });

      const respostaTexto = res.data.resposta.trim();
      let respostaObj = null;

      // 4) Tenta extrair JSON puro da respostaTexto
      try {
        const inicioJson = respostaTexto.indexOf('{');
        const fimJson = respostaTexto.lastIndexOf('}');
        if (inicioJson !== -1 && fimJson !== -1 && fimJson > inicioJson) {
          const trechoJson = respostaTexto.substring(inicioJson, fimJson + 1);
          respostaObj = JSON.parse(trechoJson);
        } else {
          respostaObj = null;
        }
      } catch {
        respostaObj = null;
      }

      // 5) Se veio JSON, executa ação e exibe confirmação simples
      if (respostaObj) {
        switch (respostaObj.acao) {
          case 'cadastrar_paciente': {
            try {
              await axios.post('http://localhost:5000/api/pacientes', respostaObj.dados);
              const textoConfirm = 'Paciente cadastrado';
              const botMsg = { autor: 'bot', texto: textoConfirm };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            } catch (err) {
              // Se CPF duplicado ou outro erro 400, agenda a mensagem de erro
              const erroMsg =
                err.response?.data?.mensagem ||
                'Erro ao cadastrar paciente. Tente novamente.';
              const botMsg = { autor: 'bot', texto: erroMsg };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            }
            break;
          }
          case 'cadastrar_profissional': {
            try {
              await axios.post('http://localhost:5000/api/profissionais', respostaObj.dados);
              const textoConfirm = 'Profissional cadastrado';
              const botMsg = { autor: 'bot', texto: textoConfirm };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            } catch (err) {
              const erroMsg =
                err.response?.data?.mensagem ||
                'Erro ao cadastrar profissional. Tente novamente.';
              const botMsg = { autor: 'bot', texto: erroMsg };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            }
            break;
          }
          case 'agendar_consulta': {
            try {
              const dadosConsulta = {
                paciente: respostaObj.idPaciente,
                profissional: respostaObj.idProfissional,
                data: respostaObj.data,
                horario: respostaObj.horario,
                observacoes: respostaObj.observacoes || ''
              };
              await axios.post('http://localhost:5000/api/consultas', dadosConsulta);
              onAgendamentoConcluido();
              const textoConfirm = 'Consulta agendada';
              const botMsg = { autor: 'bot', texto: textoConfirm };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            } catch (err) {
              const erroMsg =
                err.response?.data?.mensagem ||
                'Erro ao agendar consulta. Tente novamente.';
              const botMsg = { autor: 'bot', texto: erroMsg };
              setConversas((prev) => [...prev, botMsg]);
              setContexto((prev) => [...prev, botMsg]);
            }
            break;
          }
          default: {
            // JSON com ação desconhecida: exibe texto inteiro
            const botMsg = { autor: 'bot', texto: respostaTexto };
            setConversas((prev) => [...prev, botMsg]);
            setContexto((prev) => [...prev, botMsg]);
            break;
          }
        }
      } else {
        // 6) Resposta em texto puro (pergunta de campo, etc.)
        const botMsg = { autor: 'bot', texto: respostaTexto };
        setConversas((prev) => [...prev, botMsg]);
        setContexto((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('↪️ [Chatbot.jsx] Erro no fetch do bot:', err.response?.data || err.message);
      const textoErro = 'Ocorreu um erro. Confira o console.';
      const botMsg = { autor: 'bot', texto: textoErro };
      setConversas((prev) => [...prev, botMsg]);
      setContexto((prev) => [...prev, botMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          placeholder="Escreva aqui..."
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
