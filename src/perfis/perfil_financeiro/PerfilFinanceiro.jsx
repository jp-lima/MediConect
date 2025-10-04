import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import FinanceiroItems from "../../data/sidebar-items-financeiro.json"; 
import Inicio from "../../pages/Inicio";
import FinanceiroDashboard from "../../pages/FinanceiroDashboard";


function PerfilFinanceiro({ onLogout }) {
  return (
      <div id="app" className="active">
        <Sidebar onLogout={onLogout} menuItems={FinanceiroItems}  />
        <div id="main">
          <Routes>
            <Route path="/" element={<FinanceiroDashboard/>}/>
            <Route path="controlefinanceiro" element={<FinanceiroDashboard/>}/>
            <Route path="*" element={<h2>Página não encontrada</h2>} />
          </Routes>
        </div>
      </div>
  );
}

export default PerfilFinanceiro;
