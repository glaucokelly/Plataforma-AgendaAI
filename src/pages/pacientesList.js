import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PacientesList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pacientes');
        setPacientes(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar pacientes');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPacientes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await axios.delete(`http://localhost:5000/api/pacientes/${id}`);
        setPacientes(pacientes.filter(paciente => paciente._id !== id));
      } catch (err) {
        setError('Erro ao excluir paciente');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="pacientes-list">
      <div className="card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Pacientes</h1>
          <Link to="/pacientes/novo" className="btn btn-primary">
            Novo Paciente
          </Link>
        </div>

        {pacientes.length === 0 ? (
          <p>Nenhum paciente cadastrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(paciente => (
                  <tr key={paciente._id}>
                    <td>{paciente.nome}</td>
                    <td>{paciente.cpf}</td>
                    <td><b>Telefone:</b> {paciente.contato.telefone} <br/> <b>Email:</b> {paciente.contato.email}</td>
                    <td>
                      <Link to={`/pacientes/${paciente._id}`} className="btn btn-sm btn-secondary me-2">
                        Detalhes
                      </Link>
                      <Link to={`/pacientes/editar/${paciente._id}`} className="btn btn-sm btn-secondary me-2">
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(paciente._id)} 
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

export default PacientesList;