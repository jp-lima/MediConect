import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import FinanceiroItems from "../../data/sidebar-items-financeiro.json"; 
import Inicio from "../../pages/Inicio";
import TablePaciente from "../../pages/TablePaciente";
import FinanceiroDashboard from "../../pages/FinanceiroDashboard";
import DoctorTable from "../../pages/DoctorTable";
import Details from "../../pages/Details";
import DoctorDetails from "../../pages/DoctorDetails";

function PerfilFinanceiro({ onLogout }) {
  return (
      <div id="app" className="active">
        <Sidebar onLogout={onLogout} menuItems={FinanceiroItems}  />
        <div id="main">
          <Routes>
            <Route path="/" element={<FinanceiroDashboard/>}/>
            <Route path="inicio" element={<Inicio />} />
            <Route path="controlefinanceiro" element={<FinanceiroDashboard/>}/>
            <Route path="pacientes" element={<TablePaciente />} />
            <Route path="medicos" element={<DoctorTable />} />
            <Route path="pacientes/:id" element={<Details />} />
            <Route path="medicos/:id" element={<DoctorDetails />} />
            <Route path="*" element={<h2>Página não encontrada</h2>} />
          </Routes>
        </div>
      </div>
  );
}

export default PerfilFinanceiro;
