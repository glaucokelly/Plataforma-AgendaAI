import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfissionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profissional, setProfissional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfissional = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profissionais/${id}`);
        setProfissional(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do profissional');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfissional();
  }, [id]);

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const nomeDiaSemana = (dia) => {
    const dias = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return dias[dia];
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profissional) return <div className="alert alert-danger">Profissional não encontrado</div>;

  return (
    <div className="profissional-detail">
      <div className="card">
        <h1>Detalhes do Profissional</h1>
        
        <div className="profissional-info">
          <h2>{profissional.nome}</h2>
          
          <div className="info-section">
            <h3>Informações Profissionais</h3>
            <p><strong>Especialidade:</strong> {profissional.especialidade}</p>
            <p><strong>CRM:</strong> {profissional.crm}</p>
            <p><strong>Telefone:</strong> {profissional.telefone}</p>
            <p><strong>Email:</strong> {profissional.email || 'Não informado'}</p>
          </div>
          
          <div className="info-section">
            <h3>Dias de Atendimento</h3>
            {profissional.diasAtendimento && profissional.diasAtendimento.length > 0 ? (
              <ul className="dias-atendimento">
                {profissional.diasAtendimento.map((dia, index) => (
                  <li key={index}>
                    <strong>{nomeDiaSemana(dia.diaSemana)}:</strong> {dia.horaInicio} às {dia.horaFim}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum dia de atendimento cadastrado</p>
            )}
          </div>
          
          <div className="info-section">
            <h3>Informações do Sistema</h3>
            <p><strong>Data de Cadastro:</strong> {formatarData(profissional.dataCadastro)}</p>
          </div>
          
          <div className="actions">
            <button 
              onClick={() => navigate(`/profissionais/editar/${profissional._id}`)} 
              className="btn btn-primary me-2"
            >
              Editar
            </button>
            <button 
              onClick={() => navigate('/profissionais')} 
              className="btn btn-secondary"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfissionalDetail;