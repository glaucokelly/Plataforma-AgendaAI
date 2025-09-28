import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

const CalendarioConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

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

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para verificar se uma data tem consultas
  const temConsultas = (date) => {
    const dataFormatada = date.toISOString().split('T')[0];
    return consultas.some(consulta => {
      const consultaData = new Date(consulta.data).toISOString().split('T')[0];
      return consultaData === dataFormatada;
    });
  };

  // Função para obter as consultas de uma data específica
  const getConsultasDoDia = (date) => {
    const dataFormatada = date.toISOString().split('T')[0];
    return consultas.filter(consulta => {
      const consultaData = new Date(consulta.data).toISOString().split('T')[0];
      return consultaData === dataFormatada;
    }).sort((a, b) => {
      // Ordenar por horário
      return a.horario.localeCompare(b.horario);
    });
  };

  // Função para renderizar o conteúdo de cada dia no calendário
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const consultasDoDia = getConsultasDoDia(date);
    
    if (consultasDoDia.length === 0) return null;
    
    return (
      <div className="consultas-do-dia">
        {consultasDoDia.slice(0, 3).map((consulta, index) => (
          <div 
            key={index} 
            className={`consulta-item consulta-${consulta.status}`}
            title={`${consulta.horario} - ${consulta.paciente.nome} com ${consulta.profissional.nome}`}
          >
            {consulta.horario} - {consulta.paciente.nome.split(' ')[0]}
          </div>
        ))}
        {consultasDoDia.length > 3 && (
          <div className="consulta-item consulta-mais">
            +{consultasDoDia.length - 3} mais
          </div>
        )}
      </div>
    );
  };

  // Função para renderizar a classe de cada dia no calendário
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    return temConsultas(date) ? 'tem-consultas' : null;
  };

  // Quando uma data é clicada no calendário
  const handleDateClick = (value) => {
    setDate(value);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const consultasDoDia = getConsultasDoDia(date);

  return (
    <div className="calendario-consultas">
      <div className="card mb-4">
        <h1>Calendário de Consultas</h1>
        
        <div className="calendar-container">
          <Calendar 
            onChange={handleDateClick}
            value={date}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="pt-BR"
          />
        </div>
      </div>
      
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Consultas do dia {formatarData(date)}</h2>
          <Link to="/consultas/nova" className="btn btn-primary">
            Nova Consulta
          </Link>
        </div>
        
        {consultasDoDia.length === 0 ? (
          <p>Nenhuma consulta agendada para este dia.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultasDoDia.map(consulta => (
                  <tr key={consulta._id}>
                    <td>{consulta.horario}</td>
                    <td>{consulta.paciente.nome}</td>
                    <td>{consulta.profissional.nome} ({consulta.profissional.especialidade})</td>
                    <td className={`text-${consulta.status === 'agendada' ? 'primary' : 
                                          consulta.status === 'confirmada' ? 'success' : 
                                          consulta.status === 'cancelada' ? 'danger' : 'secondary'}`}>
                      {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                    </td>
                    <td>
                      <Link to={`/consultas/editar/${consulta._id}`} className="btn btn-sm btn-secondary me-2">
                        Editar
                      </Link>
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

export default CalendarioConsultas;
