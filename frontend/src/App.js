import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.js';
import Footer from './components/footer.js';
import Home from './pages/home.js';
import PacientesList from './pages/pacientesList.js';
import PacienteDetail from './pages/pacienteDetail.js';
import PacienteForm from './pages/pacienteForm.js';
import ProfissionaisList from './pages/profissionalList.js';
import ProfissionalDetail from './pages/profissionalDetail.js';
import ProfissionalForm from './pages/profissionalForm.js';
import ConsultasList from './pages/consultasList.js';
import ConsultaForm from './pages/consultaForm.js';
import CalendarioConsultas from './pages/calendarioConsultas.js';
import './App.css';
import Chatbot from './components/Chatbot.jsx'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/pacientes" element={<PacientesList />} />
            <Route path="/pacientes/novo" element={<PacienteForm />} />
            <Route path="/pacientes/editar/:id" element={<PacienteForm />} />
            <Route path="/pacientes/:id" element={<PacienteDetail />} />
            
            <Route path="/profissionais" element={<ProfissionaisList />} />
            <Route path="/profissionais/novo" element={<ProfissionalForm />} />
            <Route path="/profissionais/editar/:id" element={<ProfissionalForm />} />
            <Route path="/profissionais/:id" element={<ProfissionalDetail />} />
            
            <Route path="/consultas" element={<ConsultasList />} />
            <Route path="/consultas/nova" element={<ConsultaForm />} />
            <Route path="/consultas/editar/:id" element={<ConsultaForm />} />
            
            <Route path="/calendario" element={<CalendarioConsultas />} />
          </Routes>
        </main>
        <Footer />
      </div>
    <Chatbot/>
    </Router>
  );
}

export default App;