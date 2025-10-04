import React, { useState, useEffect } from "react";
import API_KEY from "../components/utils/apiKeys";
import { useAuth } from "../components/utils/AuthProvider";
import { Link } from "react-router-dom";

function TableDoctor() {
  const { getAuthorizationHeader, isAuthenticated } = useAuth();

  const [medicos, setMedicos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroAniversariante, setFiltroAniversariante] = useState(false);

  //  estados do modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Função para excluir médicos
  const deleteDoctor = async (id) => {
     
    const authHeader = getAuthorizationHeader()
    console.log(id, 'teu id')
    
    var myHeaders = new Headers();
      myHeaders.append('apikey', API_KEY);
      myHeaders.append("Authorization", authHeader)
    
    
    var requestOptions = { method: "DELETE", redirect: "follow", headers:myHeaders };

    try {
      const result = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`,
        requestOptions
      );
      setMedicos((prev) => prev.filter((p) => p.id !== id));
      console.log(result)
    } catch (error) {
      console.log("Deu problema", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Função para verificar se hoje é aniversário
  const ehAniversariante = (dataNascimento) => {
    if (!dataNascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    return (
      hoje.getDate() === nascimento.getDate() &&
      hoje.getMonth() === nascimento.getMonth()
    );
  };

  // Buscar médicos da API
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

  fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions)
    .then(response => response.json())
    .then(result => setMedicos(result))
    .catch(error => console.log('error', error));
  }, []);

  // Filtrar médicos pelo campo de pesquisa e aniversariantes
  const medicosFiltrados = medicos.filter(
    (medico) =>
      `${medico.nome} ${medico.cpf} ${medico.email} ${medico.telefone}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filtroAniversariante ? ehAniversariante(medico.data_nascimento) : true)
  );

  return (
    <>
      <div className="page-heading">
        <h3>Lista de Médicos</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Médicos Cadastrados</h4>
               <Link to={'cadastro'}>
                  <button
                    className="btn btn-primary"
                    
                  >
                    <i className="bi bi-plus-circle"></i> Adicionar Médico
                  </button>
                </Link>
              </div>

              <div className="card-body">
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Pesquisar médico..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                  />

                  <button
                    className={`btn ${
                      filtroAniversariante
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setFiltroAniversariante(!filtroAniversariante)}
                  >
                    <i className="bi bi-calendar me-1"></i> Aniversariantes
                  </button>
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
                      {medicosFiltrados.length > 0 ? (
                        medicosFiltrados.map((medico) => (
                          <tr key={medico.id}>
                            <td>{medico.full_name}</td>
                            <td>{medico.cpf}</td>
                            <td>{medico.email}</td>
                            <td>{medico.telefone}</td>
                            <td>
                              <span
                                className={`badge ${
                                  medico.ativo === "ativo"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {medico.ativo}
                              </span>
                            </td>

                            <td>
                              <div className="d-flex gap-2">
                                {/* Ver Detalhes */}
                                <Link to={`${medico.id}`}>
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#E6F2FF",
                                      color: "#004085",
                                    }}
                                    onClick={() => {
                                    console.log('editar')
                                      
                                    }}
                                  >
                                    <i className="bi bi-eye me-1"></i> Ver
                                    Detalhes
                                  </button>
                                </Link>

                                {/*  Editar */}
                                <Link to={`${medico.id}/edit`}>
                                    <button
                                      className="btn btn-sm"
                                      style={{
                                        backgroundColor: "#FFF3CD",
                                        color: "#856404",
                                      }}
                                      onClick={() => {
                                        
                                        console.log('Editar')
                                      }}
                                    >
                                      <i className="bi bi-pencil me-1"></i> Editar
                                    </button>
                                </Link>

                                
                                <button
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "#F8D7DA",
                                    color: "#721C24",
                                  }}
                                  onClick={() => {
                                    setSelectedDoctorId(medico.id);
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
                          <td colSpan="6" className="text-center">
                            Nenhum médico encontrado.
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

      {/*  Modal de confirmação de exclusão */}
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
              <div className="modal-header" style={{ backgroundColor: '#b91c1c' }}>
                <h5 className="modal-title text-dark"> Confirmação de Exclusão</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0 fs-5" style={{ color: '#111' }}>
                  Tem certeza que deseja excluir este médico?
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
                  onClick={() => deleteDoctor(selectedDoctorId)}
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

export default TableDoctor;
