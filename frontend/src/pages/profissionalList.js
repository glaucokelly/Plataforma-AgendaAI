import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfissionaisList = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profissionais');
        setProfissionais(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar profissionais');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfissionais();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await axios.delete(`http://localhost:5000/api/profissionais/${id}`);
        setProfissionais(profissionais.filter(profissional => profissional._id !== id));
      } catch (err) {
        setError('Erro ao excluir profissional');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="profissionais-list">
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Profissionais</h1>
          <Link to="/profissionais/novo" className="btn btn-primary">
            Novo Profissional
          </Link>
        </div>

        {profissionais.length === 0 ? (
          <p>Nenhum profissional cadastrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Especialidade</th>
                  <th>CRM</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {profissionais.map(profissional => (
                  <tr key={profissional._id}>
                    <td>{profissional.nome}</td>
                    <td>{profissional.especialidade}</td>
                    <td>{profissional.crm}</td>
                    <td>{profissional.telefone}</td>
                    <td>
                      <Link to={`/profissionais/${profissional._id}`} className="btn btn-sm btn-secondary me-2">
                        Detalhes
                      </Link>
                      <Link to={`/profissionais/editar/${profissional._id}`} className="btn btn-sm btn-secondary me-2">
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(profissional._id)} 
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

export default ProfissionaisList;