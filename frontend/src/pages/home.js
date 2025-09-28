import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="card">
        <h1>Sistema de Gerenciamento de Consultas Clínicas</h1>
        <p>
          Bem-vindo ao sistema de gerenciamento de consultas da clínica. 
          Utilize este sistema para agendar, remarcar, editar e cancelar consultas, 
          além de gerenciar pacientes e profissionais.
        </p>
        
        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="action-buttons">
            <Link to="/consultas/nova" className="btn btn-primary">
              Agendar Nova Consulta
            </Link>
            <Link to="/calendario" className="btn btn-secondary">
              Ver Calendário
            </Link>
            <Link to="/pacientes/novo" className="btn btn-secondary">
              Cadastrar Paciente
            </Link>
            <Link to="/profissionais/novo" className="btn btn-secondary">
              Cadastrar Profissional
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;