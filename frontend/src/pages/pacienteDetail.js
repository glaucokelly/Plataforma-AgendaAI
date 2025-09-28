import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PacienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pacientes/${id}`);
        setPaciente(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do paciente');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPaciente();
  }, [id]);

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!paciente) return <div className="alert alert-danger">Paciente não encontrado</div>;

  return (
    <div className="paciente-detail">
      <div className="card">
        <h1>Detalhes do Paciente</h1>
        
        <div className="paciente-info">
          <h2>{paciente.nome}</h2>
          
          <div className="info-section">
            <h3>Informações Pessoais</h3>
            <p><strong>CPF:</strong> {paciente.cpf}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(paciente.dataNascimento)}</p>
            <p><strong>Telefone:</strong> {paciente.telefone}</p>
            <p><strong>Email:</strong> {paciente.email || 'Não informado'}</p>
          </div>
          
          <div className="info-section">
            <h3>Endereço</h3>
            {paciente.endereco ? (
              <>
                <p>
                  {paciente.endereco.rua}, {paciente.endereco.numero}
                  {paciente.endereco.complemento && ` - ${paciente.endereco.complemento}`}
                </p>
                <p>
                  {paciente.endereco.bairro && `${paciente.endereco.bairro}, `}
                  {paciente.endereco.cidade && `${paciente.endereco.cidade} - `}
                  {paciente.endereco.estado}
                </p>
                <p>{paciente.endereco.cep}</p>
              </>
            ) : <p>Endereço não informado</p>}
          </div>
          
          <div className="info-section">
            <h3>Histórico Médico</h3>
            <p>{paciente.historico || 'Nenhum histórico registrado'}</p>
          </div>
          
          <div className="info-section">
            <h3>Informações do Sistema</h3>
            <p><strong>Data de Cadastro:</strong> {formatarData(paciente.dataCadastro)}</p>
          </div>
          
          <div className="actions">
            <button 
              onClick={() => navigate(`/pacientes/editar/${paciente._id}`)} 
              className="btn btn-primary me-2"
            >
              Editar
            </button>
            <button 
              onClick={() => navigate('/pacientes')} 
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

export default PacienteDetail;