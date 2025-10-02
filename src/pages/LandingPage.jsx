import React from 'react';
import { useNavigate } from "react-router-dom";
import './style/LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    // Usa a classe de isolamento CSS
    <div className="landing-page-public-view">
      {/* CABEÇALHO */}
      <header className="landing-header">
        <div className="logo">
          {/* Logo da Landing Page. O CSS irá estilizá-la corretamente. */}
          <h1>MediConnect</h1>
        </div>
        <nav className="nav-menu">
          <a href="#home">Início</a>
          <a href="#services">Serviços</a>
          <a href="#contact">Contato</a>
          {/* Botão para entrar no sistema interno */}
          <button className="access-button" onClick={() => navigate('/login')}>
            Acessar Sistema
          </button>
        </nav>
      </header>

      {/* ÁREA DE DESTAQUE (HERO SECTION) */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Título Legível (Branco) */}
          <h2 className="hero-title">
            Descubra o Equilíbrio Perfeito de <br />Cuidado e Tecnologia.
          </h2>
          <p>
            Somos focados em oferecer a melhor experiência para pacientes e a gestão mais eficiente para a clínica.
          </p>
          {/* Botão de ação principal: "Acessar Sistema" */}
          <button className="main-action-button" onClick={() => navigate('/login')}>
            Acessar Sistema
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;