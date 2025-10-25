import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; 
import PacienteItems from "../../data/sidebar-items-paciente.json";
import { useState } from "react";
import LaudoManager from "../../pages/LaudoManager";
import ConsultaCadastroManager from "../../PagesPaciente/ConsultaCadastroManager";
import ConsultasPaciente from "../../PagesPaciente/ConsultasPaciente";
import ConsultaEditPage from "../../PagesPaciente/ConsultaEditPage";
function PerfilPaciente({ onLogout }) {

const [dadosConsulta, setConsulta] = useState({})


  return (

    <div id="app" className="active">
      <Sidebar onLogout={onLogout} menuItems={PacienteItems} /> 
      
      <div id="main">
        <Routes>
          <Route path="/" element={<LaudoManager />} /> 
          <Route path="agendamento" element={<ConsultasPaciente setConsulta={setConsulta}/>} />
          <Route path="agendamento/criar" element={<ConsultaCadastroManager />} />
          <Route path="agendamento/edit" element={<ConsultaEditPage dadosConsulta={dadosConsulta} />} />
          <Route path="laudo" element={<LaudoManager />} /> 
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilPaciente;