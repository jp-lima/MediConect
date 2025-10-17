import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_KEY from "../components/utils/apiKeys";
import { useAuth } from "../components/utils/AuthProvider";
import "./style/TablePaciente.css"; 

function TablePaciente({ setCurrentPage, setPatientID }) {

  const { getAuthorizationHeader, isAuthenticated } = useAuth();

  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroConvenio, setFiltroConvenio] = useState("Todos");
  const [filtroVIP, setFiltroVIP] = useState(false);
  const [filtroAniversariante, setFiltroAniversariante] = useState(false);
  const [showFiltrosAvancados, setShowFiltrosAvancados] = useState(false);
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [idadeMinima, setIdadeMinima] = useState("");
  const [idadeMaxima, setIdadeMaxima] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

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

  const deletePatient = async (id) => {

    const authHeader = getAuthorizationHeader()
    console.log(id)
    var myHeaders = new Headers();
    myHeaders.append('apikey', API_KEY);
    myHeaders.append("Authorization", authHeader)


    var requestOptions = { method: "DELETE", redirect: "follow", headers: myHeaders };

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

  const ehAniversariante = (dataNascimento) => {
    if (!dataNascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    return (
      hoje.getDate() === nascimento.getDate() &&
      hoje.getMonth() === nascimento.getMonth()
    );
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const limparFiltros = () => {
    setSearch("");
    setFiltroConvenio("Todos");
    setFiltroVIP(false);
    setFiltroAniversariante(false);
    setFiltroCidade("");
    setFiltroEstado("");
    setIdadeMinima("");
    setIdadeMaxima("");
    setDataInicial("");
    setDataFinal("");
  };

  const pacientesFiltrados = Array.isArray(pacientes) ? pacientes.filter((paciente) => {
   
    const buscaNome = paciente.full_name?.toLowerCase().includes(search.toLowerCase());
    const buscaCPF = paciente.cpf?.toLowerCase().includes(search.toLowerCase());
    const passaBusca = search === "" || buscaNome || buscaCPF;


    const passaConvenio = filtroConvenio === "Todos" || paciente.insurance_plan === filtroConvenio;

    const passaVIP = filtroVIP ? paciente.vip === true : true;
    const passaAniversario = filtroAniversariante
      ? ehAniversariante(paciente.birth_date)
      : true;

  
    const passaCidade = filtroCidade ?
      paciente.city?.toLowerCase().includes(filtroCidade.toLowerCase()) : true;

    const passaEstado = filtroEstado ?
      paciente.state?.toLowerCase().includes(filtroEstado.toLowerCase()) : true;

   
    const idade = calcularIdade(paciente.birth_date);
    const passaIdadeMinima = idadeMinima ? idade >= parseInt(idadeMinima) : true;
    const passaIdadeMaxima = idadeMaxima ? idade <= parseInt(idadeMaxima) : true;

 
    const passaDataInicial = dataInicial ?
      paciente.last_appointment && new Date(paciente.last_appointment) >= new Date(dataInicial) : true;

    const passaDataFinal = dataFinal ?
      paciente.last_appointment && new Date(paciente.last_appointment) <= new Date(dataFinal) : true;


    const resultado = passaBusca && passaConvenio && passaVIP && passaAniversario &&
      passaCidade && passaEstado && passaIdadeMinima && passaIdadeMaxima &&
      passaDataInicial && passaDataFinal;

    return resultado;
  }) : [];

  useEffect(() => {
    console.log(` Pacientes totais: ${pacientes.length}, Filtrados: ${pacientesFiltrados.length}`);
  }, [pacientes, pacientesFiltrados, search]);

  return (
    <>
      <div className="page-heading">
        <h3>Lista de Pacientes</h3>
      </div>
      <div className="page-content table-paciente-container">
        <section className="row">
          <div className="col-12">
            <div className="card table-paciente-card">
              <div className="card-header">
                <h4 className="card-title mb-0">Pacientes Cadastrados</h4>
                <Link to={'cadastro'}>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-circle"></i> Adicionar Paciente
                  </button>
                </Link>
              </div>

              <div className="card-body">
                <div className="card p-3 mb-3 table-paciente-filters">
                  <h5 className="mb-3">
                    <i className="bi bi-funnel-fill me-2 text-primary"></i>{" "}
                    Filtros
                  </h5>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nome ou CPF..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <small className="text-muted">
                      Digite o nome completo ou número do CPF
                    </small>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <select
                      className="form-select compact-select"
                      value={filtroConvenio}
                      onChange={(e) => setFiltroConvenio(e.target.value)}
                      style={{ minWidth: "150px", maxWidth: "200px" }} 
                    >
                      <option value="Todos">Todos os Convênios</option>
                      <option value="Bradesco Saúde">Bradesco Saúde</option>
                      <option value="Hapvida">Hapvida</option>
                      <option value="Unimed">Unimed</option>
                    </select>

                    <button
                      className={`btn btn-sm ${filtroVIP ? "btn-primary" : "btn-outline-primary"}`} 
                      style={{ padding: "0.25rem 0.5rem" }} 
                    >
                      <i className="bi bi-award me-1"></i> VIP
                    </button>

                    <button
                      className={`btn btn-sm ${filtroAniversariante ? "btn-primary" : "btn-outline-primary"
                        }`}
                      onClick={() => setFiltroAniversariante(!filtroAniversariante)}
                      style={{ padding: "0.25rem 0.5rem" }} 
                    >
                      <i className="bi bi-calendar me-1"></i> Aniversariantes
                    </button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => setShowFiltrosAvancados(!showFiltrosAvancados)}
                    >
                      <i className={`bi bi-chevron-${showFiltrosAvancados ? 'up' : 'down'} me-1`}></i>
                      Filtros Avançados
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={limparFiltros}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i> Limpar Filtros
                    </button>
                  </div>

                  {showFiltrosAvancados && (
                    <div className="mt-3 p-3 border rounded advanced-filters">
                      <h6 className="mb-3">Filtros Avançados</h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Cidade</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Digite a cidade..."
                            value={filtroCidade}
                            onChange={(e) => setFiltroCidade(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Estado</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Minas Gerais"
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">Idade mínima</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Ex: 18"
                            value={idadeMinima}
                            onChange={(e) => setIdadeMinima(e.target.value)}
                            min="0"
                            max="150"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Idade máxima</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Ex: 65"
                            value={idadeMaxima}
                            onChange={(e) => setIdadeMaxima(e.target.value)}
                            min="0"
                            max="150"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">Data inicial</label>
                          <input
                            type="date"
                            className="form-control"
                            value={dataInicial}
                            onChange={(e) => setDataInicial(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Data final</label>
                          <input
                            type="date"
                            className="form-control"
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {(search || filtroConvenio !== "Todos" || filtroVIP || filtroAniversariante ||
                  filtroCidade || filtroEstado || idadeMinima || idadeMaxima || dataInicial || dataFinal) && (
                    <div className="alert alert-info mb-3 filters-active">
                      <strong>Filtros ativos:</strong>
                      <div className="mt-1">
                        {search && <span className="badge bg-primary me-2">Busca: "{search}"</span>}
                        {filtroConvenio !== "Todos" && <span className="badge bg-primary me-2">Convênio: {filtroConvenio}</span>}
                        {filtroVIP && <span className="badge bg-primary me-2">VIP</span>}
                        {filtroAniversariante && <span className="badge bg-primary me-2">Aniversariantes</span>}
                        {filtroCidade && <span className="badge bg-primary me-2">Cidade: {filtroCidade}</span>}
                        {filtroEstado && <span className="badge bg-primary me-2">Estado: {filtroEstado}</span>}
                        {idadeMinima && <span className="badge bg-primary me-2">Idade mín: {idadeMinima}</span>}
                        {idadeMaxima && <span className="badge bg-primary me-2">Idade máx: {idadeMaxima}</span>}
                        {dataInicial && <span className="badge bg-primary me-2">Data inicial: {dataInicial}</span>}
                        {dataFinal && <span className="badge bg-primary me-2">Data final: {dataFinal}</span>}
                      </div>
                    </div>
                  )}

                <div className="mb-3">
                  <span className="badge results-badge">
                    {pacientesFiltrados.length} de {pacientes.length} pacientes encontrados
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover table-paciente-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Convênio</th>
                        <th>Email</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientesFiltrados.length > 0 ? (
                        pacientesFiltrados.map((paciente) => (
                          <tr key={paciente.id}>
                            <td>
                              <div className="d-flex align-items-center patient-name-container">
                                {paciente.full_name}
                                <div className="d-flex patient-badges">
                                  {ehAniversariante(paciente.birth_date) && (
                                    <span className="badge anniversary-badge ms-2" title="Aniversariante do dia">
                                      <i className="bi bi-gift"></i>
                                    </span>
                                  )}
                                  {paciente.vip && (
                                    <span className="badge vip-badge ms-2" title="Paciente VIP">
                                      VIP
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{paciente.cpf}</td>
                            <td>
                              <span className="badge insurance-badge">
                                {paciente.insurance_plan || 'Não informado'}
                              </span>
                            </td>
                            <td>{paciente.email || 'Não informado'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`${paciente.id}`}>
                                  <button className="btn btn-sm btn-view">
                                    <i className="bi bi-eye me-1"></i> Ver Detalhes
                                  </button>
                                </Link>

                                <Link to={`${paciente.id}/edit`}>
                                  <button className="btn btn-sm btn-edit">
                                    <i className="bi bi-pencil me-1"></i> Editar
                                  </button>
                                </Link>

                                <button
                                  className="btn btn-sm btn-delete"
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
                          <td colSpan="5" className="empty-state">
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

      {showDeleteModal && (
        <div
          className="modal fade show delete-modal"
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
              <div className="modal-header">
                <h5 className="modal-title">
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