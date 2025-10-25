import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const ENDPOINT_LISTAR = "https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_availability";


const MEDICOS_MOCKADOS = [
    { id: 53, nome: " João Silva" },
    { id: 19, nome: " Ana Costa" },
    { id: 11, nome: " Pedro Santos" },

];


const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];


const formatarDataHora = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const data = new Date(isoString);

    return data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  } catch (error) {
    return "Data Inválida";
  }
};


const DisponibilidadesDoctorPage = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroMedicoNome, setFiltroMedicoNome] = useState("");

  const [medicoEncontradoId, setMedicoEncontradoId] = useState(null);


  const encontrarMedicoIdPorNome = (nome) => {
      if (!nome) return null;
      const termoBusca = nome.toLowerCase();
      

      const medico = MEDICOS_MOCKADOS.find(m => 
          m.nome.toLowerCase().includes(termoBusca)
      );
      
      return medico ? medico.id : null;
  };

  const fetchDisponibilidades = useCallback(async (nome) => {
    setLoading(true);
    setDisponibilidades([]);
    setMedicoEncontradoId(null);

    const doctorId = encontrarMedicoIdPorNome(nome);

    if (!doctorId) {
        setLoading(false);
        return;
    }
    
    const url = `${ENDPOINT_LISTAR}?select=*&doctor_id=eq.${doctorId}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      
      let dados = Array.isArray(result) ? result : [];

      setDisponibilidades(dados);
      setMedicoEncontradoId(doctorId); 
    } catch (error) {
      setDisponibilidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filtroMedicoNome) {
      const timer = setTimeout(() => {
        fetchDisponibilidades(filtroMedicoNome);
      }, 300); 

      return () => clearTimeout(timer);
    } else {
        setDisponibilidades([]);
        setMedicoEncontradoId(null);
    }
  }, [filtroMedicoNome, fetchDisponibilidades]);

  const rotaGerenciar = medicoEncontradoId 
    ? `../medicos/${medicoEncontradoId}/edit` 
    : `../medicos/novo/edit`;


  return (
    <div id="main-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
          Disponibilidades por Médico
        </h1>
        
        <Link
          to={rotaGerenciar}
          className="btn-primary"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          + Gerenciar Disponibilidades
        </Link>
      </div>

      <div className="atendimento-eprocura">
        <div className="busca-atendimento">
          <div style={{ marginRight: '10px' }}>
            <i className="fa-solid fa-user-doctor"></i>
            <input
              type="text"
              placeholder="Filtrar por Nome do Médico..."
              value={filtroMedicoNome}
              onChange={(e) => setFiltroMedicoNome(e.target.value)}
              style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "5px" }}
            />
          </div>
        </div>

        <section className="calendario-ou-filaespera">
          <div className="fila-container">
            <h2 className="fila-titulo">
              Disponibilidades Encontradas ({disponibilidades.length})
            </h2>

            {loading ? (
              <p className="text-center py-10">Carregando disponibilidades...</p>
            ) : (filtroMedicoNome && disponibilidades.length === 0) ? (
              <p className="text-center py-10">
                Nenhuma disponibilidade encontrada para o nome buscado.
              </p>
            ) : (
              <table className="fila-tabela" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[ "Dia da Semana", "Início", "Término", "Intervalo", "Tipo Consulta"].map(
                      (header) => (
                        <th
                          key={header}
                          style={{ padding: "10px", borderBottom: "2px solid #ddd", textAlign: "left" }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {disponibilidades.map((disp, index) => (
                    <tr key={disp.id || index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px", fontSize: "0.9em" }}>
                          {diasDaSemana[disp.weekday] || disp.weekday}
                      </td>
                      <td style={{ padding: "10px", fontSize: "0.9em" }}>
                          {formatarDataHora(disp.start_time)}
                      </td>
                      <td style={{ padding: "10px", fontSize: "0.9em" }}>
                          {formatarDataHora(disp.end_time)}
                      </td>
                      <td style={{ padding: "10px", fontSize: "0.9em" }}>{disp.slot_minutes}</td>
                      <td style={{ padding: "10px", fontSize: "0.9em" }}>{disp.appointment_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DisponibilidadesDoctorPage;