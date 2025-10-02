import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
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
import UserDashboard from '../../PagesAdm/gestao.jsx';
import PainelAdministrativo from '../../PagesAdm/painel.jsx';
import admItems from "../../data/sidebar-items-adm.json";
// ...restante do código...
function Perfiladm() {
  return (
    
      <div id="app" className="active">
       <Sidebar menuItems={admItems} />
        <div id="main">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pacientes/cadastro" element={<PatientCadastroManager />} />
            <Route path="/medicos/cadastro" element={<DoctorCadastroManager />} />
            <Route path="/pacientes" element={<TablePaciente />} />
            <Route path="/medicos" element={<DoctorTable />} />
            <Route path="/pacientes/:id" element={<Details />} />
            <Route path="/pacientes/:id/edit" element={<EditPage />} />
            <Route path="/medicos/:id" element={<DoctorDetails />} />
            <Route path="/medicos/:id/edit" element={<DoctorEditPage />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/laudo" element={<LaudoManager />} />
            <Route path="/laudo" element={<LaudoManager />} />
            <Route path="/gestao" element={<UserDashboard />} />
            <Route path="/painel" element={<PainelAdministrativo />} />
            <Route path="*" element={<h2>Página não encontrada</h2>} />
          </Routes>
        </div>
      </div>
    
  );
}

export default Perfiladm;