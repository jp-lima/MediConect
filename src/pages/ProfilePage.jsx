// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/ProfilePage.css";

const simulatedUserData = {
  email: "admin@squad23.com",
  role: "Administrador",
};

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.includes("/admin")) return "Administrador";
    if (path.includes("/secretaria")) return "Secretária";
    if (path.includes("/medico")) return "Médico";
    if (path.includes("/financeiro")) return "Financeiro";
    return "Usuário Padrão";
  };

  const userRole = simulatedUserData.role || getRoleFromPath();
  const userEmail = simulatedUserData.email || "email.nao.encontrado@example.com";

  const [userName, setUserName] = useState("Admin Padrão");
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") setIsEditingName(false);
  };

  const handleClose = () => navigate(-1);

  return (
    <div className="profile-overlay" role="dialog" aria-modal="true">
      <div className="profile-modal">
        <button
          className="profile-close"
          onClick={handleClose}
          aria-label="Fechar Perfil"
        >
          ×
        </button>

        <div className="profile-content">
          <div className="profile-left">
            <div className="avatar-wrapper">
              <div className="avatar-square" />
              <button
                className="avatar-edit-btn"
                title="Editar foto"
                aria-label="Editar foto"
                type="button"
              >
                ✏️
              </button>
            </div>
          </div>

          <div className="profile-right">
            <div className="profile-name-row">
              {isEditingName ? (
                <input
                  className="profile-name-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                />
              ) : (
                <h2 className="profile-username">{userName}</h2>
              )}

              <button
                className="profile-edit-inline"
                onClick={() => setIsEditingName(!isEditingName)}
                aria-label="Editar nome"
                type="button"
              >
                ✏️
              </button>
            </div>

            <p className="profile-email">
              Email: <strong>{userEmail}</strong>
            </p>

            <p className="profile-role">
              Cargo: <strong>{userRole}</strong>
            </p>

            <div className="profile-actions-row">
              <button className="btn btn-close" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
