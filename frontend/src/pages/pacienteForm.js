import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import axios from 'axios';

const PacienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
     contato: { 
      telefone: '',
      email: '',
    },
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    historico: ''
  });

  useEffect(() => {
    if (id) {
      const fetchPaciente = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/pacientes/${id}`);

          const data = res.data;
          if (data.dataNascimento) {
            data.dataNascimento = new Date(data.dataNascimento).toISOString().split('T')[0];
          }
          
          setFormData(data);
          setLoading(false);
        } catch (err) {
          setError('Erro ao carregar dados do paciente');
          setLoading(false);
          console.error(err);
        }
      };

      fetchPaciente();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

       if (id) {
        await axios.put(`http://localhost:5000/api/pacientes/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/pacientes', formData);
      }
      
      setLoading(false);
      navigate('/pacientes');
    } catch (err) {
      setError('Erro ao salvar paciente');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="paciente-form">
      <div className="card">
        <h1>{id ? 'Editar Paciente' : 'Novo Paciente'}</h1>
        
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
            <label htmlFor="dataNascimento">Data de Nascimento*</label>
            <input
              type="date"
              className="form-control"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cpf">CPF*</label>
            <input
              type="text"
              className="form-control"
              id="cpf"
              name="cpf"
              value={formData.cpf}
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
              name="contato.telefone"
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
              name="contato.email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <h3>Endereço</h3>
          
          <div className="form-group">
            <label htmlFor="endereco.rua">Rua</label>
            <input
              type="text"
              className="form-control"
              id="endereco.rua"
              name="endereco.rua"
              value={formData.endereco.rua}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.numero">Número</label>
            <input
              type="text"
              className="form-control"
              id="endereco.numero"
              name="endereco.numero"
              value={formData.endereco.numero}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.complemento">Complemento</label>
            <input
              type="text"
              className="form-control"
              id="endereco.complemento"
              name="endereco.complemento"
              value={formData.endereco.complemento}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.bairro">Bairro</label>
            <input
              type="text"
              className="form-control"
              id="endereco.bairro"
              name="endereco.bairro"
              value={formData.endereco.bairro}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.cidade">Cidade</label>
            <input
              type="text"
              className="form-control"
              id="endereco.cidade"
              name="endereco.cidade"
              value={formData.endereco.cidade}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.estado">Estado</label>
            <input
              type="text"
              className="form-control"
              id="endereco.estado"
              name="endereco.estado"
              value={formData.endereco.estado}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco.cep">CEP</label>
            <input
              type="text"
              className="form-control"
              id="endereco.cep"
              name="endereco.cep"
              value={formData.endereco.cep}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="historico">Histórico Médico</label>
            <textarea
              className="form-control"
              id="historico"
              name="historico"
              rows="4"
              value={formData.historico}
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
              onClick={() => navigate('/pacientes')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PacienteForm;