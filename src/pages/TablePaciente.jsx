import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_KEY from "../components/utils/apiKeys";
import { useAuth } from "../components/utils/AuthProvider";



function TablePaciente({ setCurrentPage, setPatientID }) {
  
  const {getAuthorizationHeader, isAuthenticated} = useAuth();

  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroConvenio, setFiltroConvenio] = useState("Todos");
  const [filtroVIP, setFiltroVIP] = useState(false);
  const [filtroAniversariante, setFiltroAniversariante] = useState(false);

  //  estados do modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  

  const GetAnexos = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer <token>");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://mock.apidog.com/m1/1053378-0-default/pacientes/${id}/anexos`,
        requestOptions
      );
      const result = await response.json();

      return result.data;
    } catch (error) {
      console.log("error", error);
      return [];
    }
  };

  const DeleteAnexo = async (patientID) => {
    const RespostaGetAnexos = await GetAnexos(patientID);

    for (let i = 0; i < RespostaGetAnexos.length; i++) {
      const idAnexo = RespostaGetAnexos[i].id;

      console.log("anexos", RespostaGetAnexos);

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer <token>");

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientID}/anexos/${idAnexo}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log("anexo excluido com sucesso", result))
        .catch((error) => console.log("error", error));
    }
  };

  // função de exclusão atualizada
  const deletePatient = async (id) => {
    
    const authHeader = getAuthorizationHeader()
    console.log(id)
    var myHeaders = new Headers();
    myHeaders.append('apikey', API_KEY);
    myHeaders.append("Authorization", authHeader)
    
    
    var requestOptions = { method: "DELETE", redirect: "follow", headers:myHeaders };

    try {
      const result = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${id}`,
        requestOptions
      );
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      console.log(result)
    } catch (error) {
      console.log("Deu problema", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Requisição inicial para buscar pacientes
  useEffect(() => {

     const authHeader = getAuthorizationHeader()

     console.log(authHeader, 'aqui autorização')

   var myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);
  myHeaders.append("Authorization", `${authHeader}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions)
    .then(response => response.json())
    .then(result => setPacientes(result))
    .catch(error => console.log('error', error));
  }, [isAuthenticated, getAuthorizationHeader]);

  // Função para verificar se hoje é aniversário do paciente
  const ehAniversariante = (dataNascimento) => {
    if (!dataNascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    return (
      hoje.getDate() === nascimento.getDate() &&
      hoje.getMonth() === nascimento.getMonth()
    );
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = `${paciente.nome}`.toLowerCase();

    const passaBusca = texto.includes(search.toLowerCase());
    const passaVIP = filtroVIP ? paciente.vip === true : true;
    const passaConvenio =
      filtroConvenio === "Todos" || paciente.convenio === filtroConvenio;
    const passaAniversario = filtroAniversariante
      ? ehAniversariante(paciente.data_nascimento)
      : true;

    return passaBusca && passaVIP && passaConvenio && passaAniversario;
  });

  return (
    <>
      <div className="page-heading">
        <h3>Lista de Pacientes</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Pacientes Cadastrados</h4>
                <Link to={'cadastro'}>
                  <button
                    className="btn btn-primary"
                  >
                    <i className="bi bi-plus-circle"></i> Adicionar Paciente
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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        minWidth: 250,
                        maxWidth: 300,
                        width: 260,
                        flex: "0 0 auto",
                      }}
                    />

                    <select
                      className="form-select"
                      value={filtroConvenio}
                      onChange={(e) => setFiltroConvenio(e.target.value)}
                      style={{
                        minWidth: 200,
                        width: 180,
                        flex: "0 0 auto",
                      }}
                    >
                      <option>Todos os Convênios</option>
                      <option>Bradesco Saúde</option>
                      <option>Hapvida</option>
                      <option>Unimed</option>
                    </select>

                    <button
                      className={`btn ${
                        filtroVIP ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setFiltroVIP(!filtroVIP)}
                      style={{ flex: "0 0 auto", whiteSpace: "nowrap" }}
                    >
                      <i className="bi bi-award me-1"></i> VIP
                    </button>

                    <button
                      className={`btn ${
                        filtroAniversariante
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() =>
                        setFiltroAniversariante(!filtroAniversariante)
                      }
                      style={{ flex: "0 0 auto", whiteSpace: "nowrap" }}
                    >
                      <i className="bi bi-calendar me-1"></i> Aniversariantes
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th></th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientesFiltrados.length > 0 ? (
                        pacientesFiltrados.map((paciente) => (
                          <tr key={paciente.id}>
                            <td>{paciente.full_name}</td>
                            <td>{paciente.cpf}</td>
                            <td>{paciente.email}</td>
                            <td>{paciente.telefone}</td>
                            <td>
                              <span
                                className={`badge ${
                                  paciente.ativo === "ativo"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {paciente.ativo}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`/pacientes/${paciente.id}`}>
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#E6F2FF",
                                      color: "#004085",
                                    }}
                                    onClick={() => {
                                      
                                      console.log(paciente.id);
                                    }}
                                  >
                                    <i className="bi bi-eye me-1"></i> Ver Detalhes
                                  </button>
                                </Link>

                                <Link to={`/pacientes/${paciente.id}/edit`}>
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#FFF3CD",
                                      color: "#856404",
                                    }}
                                    onClick={() => {console.log(paciente.id)
                                      
                                      
                                    }}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Editar
                                  </button>
                                </Link>

                                {/* Botão que abre o modal */}
                                <button
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "#F8D7DA",
                                    color: "#721C24",
                                  }}
                                  onClick={() => {
                                    setSelectedPatientId(paciente.id);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <i className="bi bi-trash me-1"></i> Excluir
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

      {/* Modal de confirmação */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          tabIndex="-1"
          onClick={(e) =>
            e.target.classList.contains("modal") && setShowDeleteModal(false)
          }
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
          
              <div className="modal-header bg-danger bg-opacity-25">
                <h5 className="modal-title text-danger">
                  Confirmação de Exclusão
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p className="mb-0 fs-5">
                  Tem certeza que deseja excluir este paciente? 
                </p>
              </div>

              <div className="modal-footer">
         
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>

         
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deletePatient(selectedPatientId)}
                >
                  <i className="bi bi-trash me-1"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TablePaciente;
