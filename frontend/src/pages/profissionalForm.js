import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfissionalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    crm: '',
    telefone: '',
    email: '',
    diasAtendimento: []
  });

  useEffect(() => {
    if (id) {
      const fetchProfissional = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/profissionais/${id}`);
          setFormData(res.data);
          setLoading(false);
        } catch (err) {
          setError('Erro ao carregar dados do profissional');
          setLoading(false);
          console.error(err);
        }
      };

      fetchProfissional();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDiaAtendimentoChange = (index, field, value) => {
    const novosDiasAtendimento = [...formData.diasAtendimento];
    novosDiasAtendimento[index] = {
      ...novosDiasAtendimento[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      diasAtendimento: novosDiasAtendimento
    });
  };

  const adicionarDiaAtendimento = () => {
    setFormData({
      ...formData,
      diasAtendimento: [
        ...formData.diasAtendimento,
        { diaSemana: 1, horaInicio: '08:00', horaFim: '17:00' }
      ]
    });
  };

  const removerDiaAtendimento = (index) => {
    const novosDiasAtendimento = [...formData.diasAtendimento];
    novosDiasAtendimento.splice(index, 1);
    
    setFormData({
      ...formData,
      diasAtendimento: novosDiasAtendimento
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (id) {
        await axios.put(`http://localhost:5000/api/profissionais/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/profissionais', formData);
      }
      
      setLoading(false);
      navigate('/profissionais');
    } catch (err) {
      setError('Erro ao salvar profissional');
      setLoading(false);
      console.error(err);
    }
  };

  const diasSemana = [
    { valor: 0, nome: 'Domingo' },
    { valor: 1, nome: 'Segunda-feira' },
    { valor: 2, nome: 'Terça-feira' },
    { valor: 3, nome: 'Quarta-feira' },
    { valor: 4, nome: 'Quinta-feira' },
    { valor: 5, nome: 'Sexta-feira' },
    { valor: 6, nome: 'Sábado' }
  ];

  if (loading && id) return <div>Carregando...</div>;

  return (
    <div className="profissional-form">
      <div className="card">
        <h1>{id ? 'Editar Profissional' : 'Novo Profissional'}</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo*</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="especialidade">Especialidade*</label>
            <input
              type="text"
              className="form-control"
              id="especialidade"
              name="especialidade"
              value={formData.especialidade}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="crm">CRM*</label>
            <input
              type="text"
              className="form-control"
              id="crm"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefone">Telefone*</label>
            <input
              type="text"
              className="form-control"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <h3>Dias de Atendimento</h3>
          
          {formData.diasAtendimento.map((dia, index) => (
            <div key={index} className="dia-atendimento card p-3 mb-3">
              <div className="form-group">
                <label>Dia da Semana</label>
                <select
                  className="form-control"
                  value={dia.diaSemana}
                  onChange={(e) => handleDiaAtendimentoChange(index, 'diaSemana', parseInt(e.target.value))}
                >
                  {diasSemana.map(d => (
                    <option key={d.valor} value={d.valor}>{d.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Hora de Início</label>
                <input
                  type="time"
                  className="form-control"
                  value={dia.horaInicio}
                  onChange={(e) => handleDiaAtendimentoChange(index, 'horaInicio', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Hora de Término</label>
                <input
                  type="time"
                  className="form-control"
                  value={dia.horaFim}
                  onChange={(e) => handleDiaAtendimentoChange(index, 'horaFim', e.target.value)}
                />
              </div>
              
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => removerDiaAtendimento(index)}
              >
                Remover Dia
              </button>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={adicionarDiaAtendimento}
          >
            Adicionar Dia de Atendimento
          </button>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary ms-2" 
              onClick={() => navigate('/profissionais')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfissionalForm;