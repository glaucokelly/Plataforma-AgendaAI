import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ConsultasList = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/consultas');
        setConsultas(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar consultas');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConsultas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        await axios.delete(`http://localhost:5000/api/consultas/${id}`);
        setConsultas(consultas.filter(consulta => consulta._id !== id));
      } catch (err) {
        setError('Erro ao excluir consulta');
        console.error(err);
      }
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      try {
        await axios.put(`http://localhost:5000/api/consultas/${id}/cancelar`);
        
        // Atualizar o status da consulta na lista
        setConsultas(consultas.map(consulta => 
          consulta._id === id ? { ...consulta, status: 'cancelada' } : consulta
        ));
      } catch (err) {
        setError('Erro ao cancelar consulta');
        console.error(err);
      }
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'agendada': return 'text-primary';
      case 'confirmada': return 'text-success';
      case 'cancelada': return 'text-danger';
      case 'realizada': return 'text-secondary';
      default: return '';
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="consultas-list">
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Consultas</h1>
          <Link to="/consultas/nova" className="btn btn-primary">
            Nova Consulta
          </Link>
        </div>

        {consultas.length === 0 ? (
          <p>Nenhuma consulta agendada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(consulta => (
                  <tr key={consulta._id}>
                    <td>{formatarData(consulta.data)}</td>
                    <td>{consulta.horario}</td>
                    <td>{consulta.paciente.nome}</td>
                    <td>{consulta.profissional.nome} ({consulta.profissional.especialidade})</td>
                    <td className={getStatusClass(consulta.status)}>
                      {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                    </td>
                    <td>
                      <Link to={`/consultas/editar/${consulta._id}`} className="btn btn-sm btn-secondary me-2">
                        Editar
                      </Link>
                      {consulta.status !== 'cancelada' && (
                        <button 
                          onClick={() => handleCancelar(consulta._id)} 
                          className="btn btn-sm btn-warning me-2"
                        >
                          Cancelar
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(consulta._id)} 
                        className="btn btn-sm btn-danger"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultasList;