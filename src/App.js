import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/ForgotPassword";
import PerfilSecretaria from "./perfis/perfil_secretaria/PerfilSecretaria";
import LandingPage from './pages/LandingPage';
import PerfilFinanceiro from "./perfis/perfil_financeiro/PerfilFinanceiro";
import Perfiladm from "./perfis/Perfil_adm/Perfiladm";
import PerfilMedico from "./perfis/Perfil_medico/PerfilMedico";

function App() {
  // O estado controla qual view mostrar: false = Landing Page, true = Dashboard
  const [isInternalView, setIsInternalView] = useState(false);
  // const [isSecretaria, setIsSecretaria] = useState(false);

  const handleEnterSystem = () => {
    setIsInternalView(true);
  };

  const handleExitSystem = () => {
    setIsInternalView(false);
  };

  // if (isSecretaria) {
  //   return <PerfilSecretaria onLogout={() => setIsSecretaria(false)} />;
  // }
  
  // Se não estiver na visualização interna, retorna a LandingPage.
  if (!isInternalView) {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onEnterSystem={handleEnterSystem}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<Forgot />} />
        <Route path="/secretaria/*" element={<PerfilSecretaria />} />
        <Route path="/financeiro/*" element={<PerfilFinanceiro />} />
        <Route path="/medico/*" element={<PerfilMedico />} />
        <Route path="/admin/*" element={<Perfiladm />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </Router>
    )
  }
  
  // Se estiver na visualização interna, retorna o PerfilSecretaria
  return (
    // Passamos a função de saída (logout)
    <PerfilSecretaria onLogout={handleExitSystem} />
  );
}

export default App;