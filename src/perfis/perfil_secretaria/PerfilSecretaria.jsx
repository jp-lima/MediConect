//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import FinanceiroDashboard from "../../pages/FinanceiroDashboard";
import SecretariaItems from "../../data/sidebar-items-secretaria.json";
import Inicio from "../../pages/Inicio";
import TablePaciente from "../../pages/TablePaciente";
import PatientCadastroManager from "../../pages/PatientCadastroManager";
import DoctorCadastroManager from "../../pages/DoctorCadastroManager";
import DoctorTable from "../../pages/DoctorTable";
import Agendamento from "../../pages/Agendamento";
import LaudoManager from "../../pages/LaudoManager";
import Details from "../../pages/Details";
import EditPage from "../../pages/EditPage";
import DoctorDetails from "../../pages/DoctorDetails";
import DoctorEditPage from "../../pages/DoctorEditPage";
import FormDisponibilidade from "../../components/AgendarConsulta/FormDisponibilidade";
import AgendamentoEditPage from "../../pages/AgendamentoEditPage";

function PerfilSecretaria({ onLogout }) {
  return (
    // <Router>
      <div id="app" className="active">
        <Sidebar onLogout={onLogout} menuItems={SecretariaItems} />
        <div id="main">
          <Routes>
            <Route path="/" element={<Inicio/>}/>
            <Route path="pacientes/cadastro" element={<PatientCadastroManager />} />
            <Route path="medicos/cadastro" element={<DoctorCadastroManager />} />
            <Route path="pacientes" element={<TablePaciente />} />
            <Route path="medicos" element={<DoctorTable />} />
            <Route path="pacientes/:id" element={<Details />} />
            <Route path="pacientes/:id/edit" element={<EditPage />} />
            <Route path="medicos/:id" element={<DoctorDetails />} />
            <Route path="medicos/:id/edit" element={<DoctorEditPage />} />
            <Route path="agendamento" element={<Agendamento />} />
            <Route path="agendamento/:id/edit" element={<AgendamentoEditPage/>} />
             <Route path="laudo" element={<LaudoManager />} />
            <Route path="*" element={<h2>Página não encontrada</h2>} />
            <Route path="form-disponibilidade" element={<FormDisponibilidade />} />
          </Routes>
        </div>
      </div>
    // </Router>
  );
}

export default PerfilSecretaria;
