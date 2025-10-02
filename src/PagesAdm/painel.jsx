import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./painel.css";

export default function PainelAdministrativo() {
  
  const profileData = [
    { name: "Médico", value: 8 },
    { name: "Secretária", value: 5 },
    { name: "Gestão / Coordena", value: 3 },
  ];
  const COLORS = ["#1e3a8a", "#051AFF", "#0066ff"];

  
  const activityData = [
    { name: "Hoje", value: 10 },
    { name: "Esta Semana", value: 14 },
    { name: "Este Mês", value: 15 },
  ];

 
  const departamentos = [
    { nome: "Cardiologia", ativos: 3, total: 3 },
    { nome: "Ortopedia", ativos: 1, total: 2 },
    { nome: "Neurologia", ativos: 2, total: 2 },
    { nome: "Administração", ativos: 2, total: 2 },
    { nome: "Recepção", ativos: 5, total: 6 },
  ];

  return (
    <div className="painel-container">
      <h1 className="painel-titulo">Painel Administrativo</h1>
      <p className="painel-subtitulo">
        Visão geral completa do sistema MediConnect
      </p>

      
      <div className="painel-cards">
        
        <div className="painel-card">
          <div className="card-header">
            <span>Total de Usuários</span>
            <span className="badge">15</span>
          </div>
          <h2 className="card-numero">12</h2>
          <p className="card-info">3 inativos</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

    
        <div className="painel-card">
          <div className="card-header">
            <span>Novos Usuários</span>
            <span className="badge">+3</span>
          </div>
          <h2 className="card-numero">Este Mês</h2>
          <p className="card-info">+20% comparado ao mês anterior</p>
        </div>

       
        <div className="painel-card">
          <div className="card-header">
            <span>Tempo Médio de Sessão</span>
          </div>
          <h2 className="card-numero">2h 30min</h2>
          <p className="card-info">+5% comparado à semana anterior</p>
        </div>


        <div className="painel-card">
          <div className="card-header">
            <span>Taxa de Atividade</span>
          </div>
          <h2 className="card-numero">80.0%</h2>
          <p className="card-info">Usuários ativos vs total</p>
        </div>
      </div>

  
      <div className="painel-graficos">
        <div className="grafico-card">
          <h3 className="grafico-titulo">Distribuição por Perfil</h3>
          <p className="grafico-subtitulo">
            Quantidade de usuários por tipo de perfil
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={profileData}
                dataKey="value"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {profileData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

       
        <div className="grafico-card">
          <h3 className="grafico-titulo">Atividade de Usuários</h3>
          <p className="grafico-subtitulo">Usuários ativos por período</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0066ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grafico-card">
        <h3 className="grafico-titulo">Performance por Departamento</h3>
        <p className="grafico-subtitulo">
          Atividade e engajamento dos usuários por departamento
        </p>
        {departamentos.map((dep, index) => {
          const percentual = Math.round((dep.ativos / dep.total) * 100);
          return (
            <div
              key={index}
              className="department-row"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
     
              <span
                className="department-name"
                style={{ flex: 1, fontWeight: "600", color: "#000" }}
              >
                {dep.nome}
              </span>

          
              <div
                className="progress-bar"
                style={{
                  flex: 3,
                  height: "13px",
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  margin: "0 12px",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentual}%`,
                    height: "100%",
                    backgroundColor: "#0066ff",
                    borderRadius: "10px",
                  }}
                ></div>
              </div>

     
              <span
                className="department-info"
                style={{ minWidth: "120px", fontWeight: "500", color: "#333" }}
              >
                {dep.ativos}/{dep.total} ({percentual}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
