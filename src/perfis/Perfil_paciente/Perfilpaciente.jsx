import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; 
import PacienteItems from "../../data/sidebar-items-paciente.json";
import Agendamento from "../../pages/Agendamento"; 
import LaudoManager from "../../pages/LaudoManager";
function PerfilPaciente({ onLogout }) {
  return (
    <div id="app" className="active">
      <Sidebar onLogout={onLogout} menuItems={PacienteItems} /> 
      
      <div id="main">
        <Routes>
          <Route path="/" element={<LaudoManager />} /> 
          <Route path="agendamento" element={<Agendamento />} />
          <Route path="laudo" element={<LaudoManager />} /> 
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilPaciente;