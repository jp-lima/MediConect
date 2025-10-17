import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Suas páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/ForgotPassword";
import PerfilSecretaria from "./perfis/perfil_secretaria/PerfilSecretaria";
import LandingPage from './pages/LandingPage';
import PerfilFinanceiro from "./perfis/perfil_financeiro/PerfilFinanceiro";
import Perfiladm from "./perfis/Perfil_adm/Perfiladm";
import PerfilMedico from "./perfis/Perfil_medico/PerfilMedico";

// COMBINADO: Importações de ambas as versões
import PerfilPaciente from "./perfis/Perfil_paciente/Perfilpaciente"
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header/Header";

// Componentes globais de acessibilidade
import VlibrasWidget from "./components/VlibrasWidget";

import BotaoAcessibilidade from "./components/botaoacessibilidade.jsx"; 

function App() {
  return (
    <Router>
      <VlibrasWidget />
      <BotaoAcessibilidade /> 
      <Header />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<Forgot />} />
        <Route path="/secretaria/*" element={<PerfilSecretaria />} />
        <Route path="/financeiro/*" element={<PerfilFinanceiro />} />
        <Route path="/medico/*" element={<PerfilMedico />} />
        <Route path="/admin/*" element={<Perfiladm />} />

        {/* COMBINADO: Rotas de ambas as versões */}
        <Route path="/paciente/*" element={<PerfilPaciente />} />
        <Route path="/perfil" element={<ProfilePage />} />
        
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;