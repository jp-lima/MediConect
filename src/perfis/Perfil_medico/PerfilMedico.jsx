import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import Inicio from "../../pages/Inicio";
import LaudoManager from "../../pages/LaudoManager";
import Prontuario from "../../PagesMedico/prontuario";
import Relatorio from "../../PagesMedico/relatorio";
import Agendamento from "../../PagesMedico/Agendamento";
import Chat from "../../PagesMedico/Chat";
import DoctorItems from "../../data/sidebar-items-medico.json";
// ...existing code...

function PerfilMedico() {
  return (
    
      <div id="app" className="active">
        <Sidebar menuItems={DoctorItems} />
        <div id="main">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/laudo" element={<LaudoManager />} />
            <Route path="/prontuario" element={<Prontuario />} />
            <Route path="/relatorios" element={<Relatorio />} />
            <Route path="/agendamentoMedico" element={<Agendamento />} />
            <Route path="/chat" element={<Chat />} /> {/* <-- nova rota */}
          </Routes>
        </div>
      </div>
    
  );
}

export default PerfilMedico;