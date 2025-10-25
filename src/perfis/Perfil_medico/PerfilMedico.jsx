import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import DoctorRelatorioManager  from "../../PagesMedico/DoctorRelatorioManager";
import Prontuario from "../../PagesMedico/prontuario";
import Relatorio from "../../PagesMedico/relatorio";
import DoctorAgendamentoManager from "../../PagesMedico/DoctorAgendamentoManager";
import Chat from "../../PagesMedico/Chat";
import DoctorItems from "../../data/sidebar-items-medico.json";
import FormNovoRelatorio from "../../PagesMedico/FormNovoRelatorio";
import EditPageRelatorio from "../../PagesMedico/EditPageRelatorio";
// ...existing code...

function PerfilMedico() {
  return (
    
      <div id="app" className="active">
        <Sidebar menuItems={DoctorItems} />
        <div id="main">
          <Routes>
            <Route path="/" element={<DoctorRelatorioManager />} />
            <Route path="/relatorios/criar" element={<FormNovoRelatorio />} />
            <Route path="/relatorios/:id/edit" element={<EditPageRelatorio />} />
            <Route path="/prontuario" element={<Prontuario />} />
            <Route path="/relatorios" element={<DoctorRelatorioManager />} />
            <Route path="/agendamentoMedico" element={<DoctorAgendamentoManager />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    
  );
}

export default PerfilMedico;