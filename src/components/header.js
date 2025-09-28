import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        Sistema de Gerenciamento de Consultas
                    </Link>
                    <div className="navbar-menu">
                        <Link to="/calendario" className="nav-link">
                        Calendário
                        </Link>
                        <Link to="/consultas" className="nav-link">
                        Consultas
                        </Link>
                        <Link to="/pacientes" className="nav-link">
                        Pacientes
                        </Link>
                        <Link to="/profissionais" className="nav-link">
                        Profissionais
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;