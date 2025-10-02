
import React from "react";
import "./gestao.css";
import { FaEdit, FaTrash } from "react-icons/fa";


function UserDashboard() {
  return (
    
        <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Gestão de Usuários</h1>
          <p className="dashboard-subtitle">
            Gerencie usuários, perfis e permissões do sistema
          </p>
        </div>
        <button className="new-user-btn">+ Novo Usuário</button>
      </div>

      <div className="cards-container">
        <div className="card highlight">
          <p className="card-label">Total de Usuários</p>
          <p className="card-value">15</p>
          <p className="card-extra positive">+3 este mês</p>
        </div>
        <div className="card highlight">
          <p className="card-label">Usuários Ativos</p>
          <p className="card-value">12</p>
          <p className="card-extra">80.0% do total</p>
        </div>
        <div className="card highlight">
          <p className="card-label">Tempo Médio Sessão</p>
          <p className="card-value">2h 30min</p>
          <p className="card-extra">Última semana</p>
        </div>
        <div className="card highlight">
          <p className="card-label">Usuários Hoje</p>
          <p className="card-value">10</p>
          <p className="card-extra positive">+2 desde ontem</p>
        </div>
      </div>

      <div className="filters-container">
        <p className="filters-title">Filtros</p>
        <p className="filters-subtitle">
          Use os filtros abaixo para encontrar usuários específicos
        </p>
        <div className="filters-content">
          <input
            type="text"
            className="filters-input"
            placeholder="Buscar por nome ou email..."
          />
          <select className="filters-select">
            <option>Todos os perfis</option>
            <option>Médico</option>
            <option>Secretaria</option>
            <option>Gestão</option>
          </select>
          <select className="filters-select">
            <option>Todos</option>
            <option>Ativos</option>
            <option>Inativos</option>
          </select>
        </div>
      </div>

      <div className="user-table-container">
        <h2>Usuários do Sistema</h2>
        <p>Lista completa de usuários e suas permissões</p>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Departamento</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana Silva</td>
              <td>ana.silva@mediconnect.com</td>
              <td><span className="profile-badge">Gestão / Coordenação</span></td>
              <td>Administração</td>
              <td><span className="status-badge ativo">Ativo</span></td>
              <td>20/12/2024, 08:30</td>
              <td className="actions">
                <span className="action-icon"></span>
                <span className="action-icon"></span>
              </td>
            </tr>
            <tr>
              <td>Dr. Carlos Santos</td>
              <td>carlos.santos@mediconnect.com</td>
              <td><span className="profile-badge">Médico</span></td>
              <td>Cardiologia</td>
              <td><span className="status-badge ativo">Ativo</span></td>
              <td>19/12/2024, 14:20</td>
              <td className="actions">
                <span className="action-icon"></span>
                <span className="action-icon"></span>
              </td>
            </tr>
            <tr>
              <td>Maria Oliveira</td>
              <td>maria.oliveira@mediconnect.com</td>
              <td><span className="profile-badge">Secretária</span></td>
              <td>Recepção</td>
              <td><span className="status-badge ativo">Ativo</span></td>
              <td>20/12/2024, 07:45</td>
              <td className="actions">
                <span className="action-icon"></span>
                <span className="action-icon"></span>
              </td>
            </tr>
            <tr>
              <td>Dr. João Pereira</td>
              <td>joao.pereira@mediconnect.com</td>
              <td><span className="profile-badge">Médico</span></td>
              <td>Ortopedia</td>
              <td><span className="status-badge inativo">Inativo</span></td>
              <td>15/12/2024, 16:30</td>
              <td className="actions">
                <span className="action-icon"></span>
                <span className="person-badge-fill"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default UserDashboard;