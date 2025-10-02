import React, { useState, useEffect } from 'react';
import { FaUser, FaUserPlus, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import './style/Inicio.css';

function Inicio({ setCurrentPage }) {
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes");
        const data = await res.json();
        console.log(data)
        //setPacientes(data.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    const fetchAgendamentos = async () => {
      return; // <===serve para que nao cause erro
      // try {
      //   const res = await fetch();
      //   const data = await res.json();
      //   setAgendamentos(data.data);
      // } catch (error) {
      //   console.error("Erro ao buscar agendamentos:", error);
      // }
    };

    fetchPacientes();
    fetchAgendamentos();
  }, []);

  const totalPacientes = pacientes.length;
  const novosEsseMes = pacientes.filter(p => p.createdAt && new Date(p.createdAt).getMonth() === new Date().getMonth()).length;

  const hoje = new Date();
  const agendamentosDoDia = agendamentos.filter(
    a => a.data && new Date(a.data).getDate() === hoje.getDate()
  );
  const agendamentosHoje = agendamentosDoDia.length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
       
       <h1>Bem-vindo ao MediConnect</h1><br></br>
      
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">TOTAL DE PACIENTES</span>
            <span className="stat-value">{totalPacientes}</span>
          </div>
          <div className="stat-icon-wrapper blue"><FaUser className="stat-icon" /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">NOVOS ESTE MÊS</span>
            <span className="stat-value">{novosEsseMes}</span>
          </div>
          <div className="stat-icon-wrapper green"><FaUserPlus className="stat-icon" /></div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">AGENDAMENTOS HOJE</span>
            <span className="stat-value">{agendamentosHoje}</span>
          </div>
          <div className="stat-icon-wrapper purple"><FaCalendarCheck className="stat-icon" /></div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">PENDÊNCIAS</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-icon-wrapper orange"><FaCalendarAlt className="stat-icon" /></div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          <div className="action-button" onClick={() => setCurrentPage('form-layout')}>
            <FaUserPlus className="action-icon" />
            <div className="action-info">
              <span className="action-title">Novo Paciente</span>
              <span className="action-desc">Cadastrar um novo paciente</span>
            </div>
          </div>
          <div className="action-button" onClick={() => setCurrentPage('table')}>
            <FaUser className="action-icon" />
            <div className="action-info">
              <span className="action-title">Lista de Pacientes</span>
              <span className="action-desc">Ver todos os pacientes</span>
            </div>
          </div>
          <div className="action-button" onClick={() => setCurrentPage('agendamento')}>
            <FaCalendarCheck className="action-icon" />
            <div className="action-info">
              <span className="action-title">Agendamentos</span>
              <span className="action-desc">Gerenciar consultas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Próximos Agendamentos</h2>
        {agendamentosHoje > 0 ? (
          <div>
            {agendamentosDoDia.map(agendamento => (
              <div key={agendamento.id} className="agendamento-item">
                <p>{agendamento.nomePaciente}</p>
                <p>{new Date(agendamento.data).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments-content">
            <FaCalendarCheck className="no-appointments-icon" />
            <p>Nenhum agendamento para hoje</p>
            <button className="manage-button" onClick={() => setCurrentPage('agendamento')}>
              Gerenciar Agendamentos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inicio;