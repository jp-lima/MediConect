import API_KEY from '../components/utils/apiKeys';
import  { Link } from 'react-router-dom';
import {useState, useEffect} from 'react'
import { useAuth } from '../components/utils/AuthProvider';
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
const DoctorRelatorioManager = () => {
  const navigate = useNavigate()
  const {getAuthorizationHeader} = useAuth();
  let authHeader = getAuthorizationHeader()
  const [RelatoriosFiltrados, setRelatorios] = useState([])
  const [PacientesComRelatorios, setPacientesComRelatorios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [index, setIndex] = useState()

  useEffect( () => {
    let pacientesDosRelatorios = []
  
    const ListarPacientes = async () => {
      for (let i = 0; i < RelatoriosFiltrados.length; i++) {
        let relatorio = RelatoriosFiltrados[i];
        let paciente_id = relatorio.patient_id;
        const paciente = await GetPatientByID(paciente_id, authHeader);
        console.log(paciente)
        if (paciente.length > 0) {
          pacientesDosRelatorios.push(paciente[0]);
        }

      }
      setPacientesComRelatorios(pacientesDosRelatorios);

    }

    ListarPacientes()
    console.log(PacientesComRelatorios, 'aqui')

  }, [RelatoriosFiltrados]);

  useEffect(() => {
    var myHeaders = new Headers();
myHeaders.append("apikey", API_KEY);
myHeaders.append("Authorization", authHeader);

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?patient_id&status", requestOptions)
   .then(response => response.json())
   .then(data => { setRelatorios(data); console.log(data) })
   .catch(error => console.log('error', error));
  }, [])

   const BaixarPDFdoRelatorio = (nome_paciente) => {
        const elemento = document.getElementById("folhaA4"); // tua div do relatório
    const opt = {
    margin: 0,
    filename: `relatorio_${nome_paciente || "paciente"}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(elemento).save();
    }

    return (
    <div>
      {showModal && (
         <div className="modal" >
            <div className="modal-dialog modal-tabela-relatorio">
              <div className="modal-content">
                <div className="modal-header text-white">
                  <h5 className="modal-title ">Relatório de {PacientesComRelatorios[index]?.full_name} </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div id="folhaA4">

                      <div id='header-relatorio'>
                          <p>Clinica Rise up</p>
                          <p>Dr  - CRM/SP 123456</p>
                          <p>Avenida - (79) 9 4444-4444</p>
                      </div>

                      <div id='infoPaciente'>
                          <p>Paciente: {PacientesComRelatorios[index]?.full_name}</p>
                          <p>Data de nascimento: {PacientesComRelatorios[index]?.birth_date} </p>

                          <p>Data do exame: {}</p>

                          <p>Exame: {RelatoriosFiltrados[index]?.exam}</p>

                          <p>Diagnostico: {RelatoriosFiltrados[index]?.diagnosis}</p>
                          <p>Conclusão: {RelatoriosFiltrados[index]?.conclusion}</p>
                      </div>

                      <div>
                          <p>Dr {RelatoriosFiltrados[index]?.required_by}</p>
                          <p>Emitido em: 0</p>
                      </div>

                  </div>
                </div>
                <div className="modal-footer">

                  <button className="btn btn-primary" onClick={() => BaixarPDFdoRelatorio(PacientesComRelatorios[index]?.full_name)}><i className='bi bi-file-pdf-fill'></i> baixar em pdf</button>                  

                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => {setShowModal(false)}}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}


      <div className="page-heading">
        <h3>Lista de Relatórios</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Relatórios Cadastrados</h4>
                <Link to={'criar'}>
                  <button
                    className="btn btn-primary"
                  >
                    <i className="bi bi-plus-circle"></i> Adicionar Relatório
                  </button>
                </Link>
              </div>

              <div className="card-body">
                <div className="card p-3 mb-3">
                  <h5 className="mb-3">
                    <i className="bi bi-funnel-fill me-2 text-primary"></i>{" "}
                    Filtros
                  </h5>

                  <div
                    className="d-flex flex-nowrap align-items-center gap-2"
                    style={{ overflowX: "auto", paddingBottom: "6px" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nome..."
                     
                     
                      style={{
                        minWidth: 250,
                        maxWidth: 300,
                        width: 260,
                        flex: "0 0 auto",
                      }}
                    />         
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        
                        <th>Paciente</th>
                        <th>CPF</th>

                        <th>Exame</th>
                       
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {RelatoriosFiltrados.length > 0 ? (
                        RelatoriosFiltrados.map((relatorio, index) => (
                          <tr key={relatorio.id}>
                            
                            <td className='infos-paciente'>{PacientesComRelatorios[index]?.full_name}</td>
                            <td className='infos-paciente'>{PacientesComRelatorios[index]?.cpf}</td>
                            <td>{relatorio.exam}</td>
                           
                            
                            <td>
                              <div className="d-flex gap-2">
                                
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#E6F2FF",
                                      color: "#004085",
                                    }}
                                    onClick={() => {
                                      setShowModal(true); setIndex(index)
                                    }}
                                  >
                                    <i className="bi bi-eye me-1"></i> Ver Detalhes
                                  </button>
                                

                                
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#FFF3CD",
                                      color: "#856404",
                                    }}
                                    onClick={() => {
                                      
                                      navigate(`/medico/relatorios/${relatorio.id}/edit`)
                                    }}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Editar
                                  </button>
                              
                                </div>
                           
                            </td>
                        
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            Nenhum paciente encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>

  )
}

export default DoctorRelatorioManager