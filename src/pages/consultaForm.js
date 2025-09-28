import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConsultaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [formData, setFormData] = useState({
    paciente: '',
    profissional: '',
    data: '',
    horario: '',
    duracao: 30,
    status: 'agendada',
    observacoes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar pacientes
        const pacientesRes = await axios.get('http://localhost:5000/api/pacientes');
        setPacientes(pacientesRes.data);
        
        // Buscar profissionais
        const profissionaisRes = await axios.get('http://localhost:5000/api/profissionais');
        setProfissionais(profissionaisRes.data);
        
        // Se for edição, buscar dados da consulta
        if (id) {
          const consultaRes = await axios.get(`http://localhost:5000/api/consultas/${id}`);
          const consulta = consultaRes.data;
          
          // Formatar a data para o formato yyyy-MM-dd
          if (consulta.data) {
            consulta.data = new Date(consulta.data).toISOString().split('T')[0];
          }
          
          setFormData({
            paciente: consulta.paciente._id,
            profissional: consulta.profissional._id,
            data: consulta.data,
            horario: consulta.horario,
            duracao: consulta.duracao,
            status: consulta.status,
            observacoes: consulta.observacoes || ''
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (id) {
        await axios.put(`http://localhost:5000/api/consultas/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/consultas', formData);
      }
      
      setLoading(false);
      navigate('/consultas');
    } catch (err) {
      setError('Erro ao salvar consulta');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading && id) return <div>Carregando...</div>;

  return (
    <div className="consulta-form">
      <div className="card">
        <h1>{id ? 'Editar Consulta' : 'Nova Consulta'}</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="paciente">Paciente*</label>
            <select
              className="form-control"
              id="paciente"
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente._id} value={paciente._id}>
                  {paciente.nome} - CPF: {paciente.cpf}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="profissional">Profissional*</label>
            <select
              className="form-control"
              id="profissional"
              name="profissional"
              value={formData.profissional}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map(profissional => (
                <option key={profissional._id} value={profissional._id}>
                  {profissional.nome} - {profissional.especialidade}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="data">Data*</label>
            <input
              type="date"
              className="form-control"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="horario">Horário*</label>
            <input
              type="time"
              className="form-control"
              id="horario"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duracao">Duração (minutos)*</label>
            <input
              type="number"
              className="form-control"
              id="duracao"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              min="15"
              step="15"
              required
            />
          </div>
          
          {id && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="agendada">Agendada</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="realizada">Realizada</option>
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              className="form-control"
              id="observacoes"
              name="observacoes"
              rows="4"
              value={formData.observacoes}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary ms-2" 
              onClick={() => navigate('/consultas')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultaForm;