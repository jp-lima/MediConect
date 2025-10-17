import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserInfos } from "./utils/Functions-Endpoints/General";
import { useAuth } from "./utils/AuthProvider";
import "../pages/style/TrocardePerfis.css";

const TrocardePerfis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAuthorizationHeader } = useAuth();

  const [selectedProfile, setSelectedProfile] = useState("");
  const [showProfiles, setShowProfiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authHeader = getAuthorizationHeader();
      setSelectedProfile(location.pathname || "");
      const userInfo = await UserInfos(authHeader);
      setShowProfiles(userInfo?.roles || []);
    };
    fetchData();
  }, [location.pathname, getAuthorizationHeader]);

  const handleSelectChange = (e) => {
    const route = e.target.value;
    setSelectedProfile(route);
    if (route) navigate(route);
  };

  const options = [
    { key: "secretaria", label: "Secretaria", route: "/secretaria" },
    { key: "medico", label: "Médico", route: "/medico" },
    { key: "financeiro", label: "Financeiro", route: "/financeiro" },
    { key: "admin", label: "Administração", route: "/admin" },
    { key: "paciente", label: "Paciente", route: "/paciente" },
  ].filter(
    (opt) =>
      showProfiles?.includes(opt.key) || showProfiles?.includes("admin")
  );

  return (
    <div className="container-perfis">
      <p className="acesso-text">Acesso aos módulos:</p>
      <select
        className="perfil-select"
        value={selectedProfile}
        onChange={handleSelectChange}
      >
        <option value="">Selecionar perfil</option>
        {options.map((opt) => (
          <option key={opt.key} value={opt.route}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TrocardePerfis;