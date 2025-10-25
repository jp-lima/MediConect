import React, { useState, useEffect } from "react";
import API_KEY from "../components/utils/apiKeys";
import { useAuth } from "../components/utils/AuthProvider";
import { Link } from "react-router-dom";
import "./style/TableDoctor.css";

function TableDoctor() {
  const { getAuthorizationHeader, isAuthenticated } = useAuth();

  const [medicos, setMedicos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("Todos");
  const [filtroAniversariante, setFiltroAniversariante] = useState(false);


  const [showFiltrosAvancados, setShowFiltrosAvancados] = useState(false);
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [idadeMinima, setIdadeMinima] = useState("");
  const [idadeMaxima, setIdadeMaxima] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const limparFiltros = () => {
    setSearch("");
    setFiltroEspecialidade("Todos");
    setFiltroAniversariante(false);
    setShowFiltrosAvancados(false);
    setFiltroCidade("");
    setFiltroEstado("");
    setIdadeMinima("");
    setIdadeMaxima("");
    setDataInicial("");
    setDataFinal("");
  };


  const deleteDoctor = async (id) => {
    const authHeader = getAuthorizationHeader()
    console.log(id, 'teu id')

    var myHeaders = new Headers();
    myHeaders.append('apikey', API_KEY);
    myHeaders.append("Authorization", authHeader)

    var requestOptions = { method: "DELETE", redirect: "follow", headers: myHeaders };

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
      .then(result => {setMedicos(result); console.log(result)})
      .catch(error => console.log('error', error));
  }, [isAuthenticated, getAuthorizationHeader]);


  const medicosFiltrados = Array.isArray(medicos) ? medicos.filter((medico) => {
    const buscaNome = medico.full_name?.toLowerCase().includes(search.toLowerCase());
    const buscaCPF = medico.cpf?.toLowerCase().includes(search.toLowerCase());
    const buscaEmail = medico.email?.toLowerCase().includes(search.toLowerCase());
    const passaBusca = search === "" || buscaNome || buscaCPF || buscaEmail;


    const passaEspecialidade = filtroEspecialidade === "Todos" || medico.specialty === filtroEspecialidade;

    const passaAniversario = filtroAniversariante
      ? ehAniversariante(medico.birth_date)
      : true;

    const passaCidade = filtroCidade ?
      medico.city?.toLowerCase().includes(filtroCidade.toLowerCase()) : true;

    const passaEstado = filtroEstado ?
      medico.state?.toLowerCase().includes(filtroEstado.toLowerCase()) : true;

    const idade = calcularIdade(medico.birth_date);
    const passaIdadeMinima = idadeMinima ? idade >= parseInt(idadeMinima) : true;
    const passaIdadeMaxima = idadeMaxima ? idade <= parseInt(idadeMaxima) : true;


    const passaDataInicial = dataInicial ?
      medico.created_at && new Date(medico.created_at) >= new Date(dataInicial) : true;

    const passaDataFinal = dataFinal ?
      medico.created_at && new Date(medico.created_at) <= new Date(dataFinal) : true;


    const resultado = passaBusca && passaEspecialidade && passaAniversario &&
      passaCidade && passaEstado && passaIdadeMinima && passaIdadeMaxima &&
      passaDataInicial && passaDataFinal;

    return resultado;
  }) : [];
  useEffect(() => {
    console.log(` Médicos totais: ${medicos.length}, Filtrados: ${medicosFiltrados.length}`);
  }, [medicos, medicosFiltrados, search]);

  return (
    <>
      <div className="page-heading">
        <h3>Lista de Médicos</h3>
      </div>
      <div className="page-content table-doctor-container">
        <section className="row">
          <div className="col-12">
            <div className="card table-doctor-card">
              <div className="card-header">
                <h4 className="card-title mb-0">Médicos Cadastrados</h4>
                <Link to={'cadastro'}>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-circle"></i> Adicionar Médico
                  </button>
                </Link>
              </div>

              <div className="card-body">

                <div className="card p-3 mb-3 table-doctor-filters">
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


                  <div className="filtros-basicos">
                    <select
                      className="form-select filter-especialidade"
                      value={filtroEspecialidade}
                      onChange={(e) => setFiltroEspecialidade(e.target.value)}
                    >
                      <option value="Todos">Todas as Especialidades</option>
                      <option value="Clínica Geral">Clínica médica (clínico geral)</option>
                      <option value="Pediatria">Pediatria</option>
                      <option value="Ginecologia">Ginecologia e obstetrícia</option>
                      <option value="Cardiologia">Cardiologia</option>
                      <option value="Ortopedia">Ortopedia e traumatologia</option>
                      <option value="Oftalmologia">Oftalmologia</option>
                      <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                      <option value="Dermatologia">Dermatologia</option>
                      <option value="Neurologia">Neurologia</option>
                      <option value="Psiquiatria">Psiquiatria</option>
                      <option value="Endocrinologia">Endocrinologia</option>
                      <option value="Gastroenterologia">Gastroenterologia</option>
                      <option value="Urologia">Urologia</option>
                    </select>

                    <div className="filter-buttons-container">

                      <button
                        className={`btn filter-btn ${filtroAniversariante
                          ? "btn-primary"
                          : "btn-outline-primary"
                          }`}
                        onClick={() => setFiltroAniversariante(!filtroAniversariante)}
                      >
                        <i className="bi bi-calendar me-1"></i> Aniversariantes
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
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
                            placeholder="Ex: 25"
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
                            placeholder="Ex: 70"
                            value={idadeMaxima}
                            onChange={(e) => setIdadeMaxima(e.target.value)}
                            min="0"
                            max="150"
                          />
                        </div>

                        {/* Data de Cadastro */}
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


                {(search || filtroEspecialidade !== "Todos" || filtroAniversariante || // filtroVIP removido
                  filtroCidade || filtroEstado || idadeMinima || idadeMaxima || dataInicial || dataFinal) && (
                    <div className="alert alert-info mb-3 filters-active">
                      <strong>Filtros ativos:</strong>
                      <div className="mt-1">
                        {search && <span className="badge bg-primary me-2">Busca: "{search}"</span>}
                        {filtroEspecialidade !== "Todos" && <span className="badge bg-primary me-2">Especialidade: {filtroEspecialidade}</span>}

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
                    {medicosFiltrados.length} de {medicos.length} médicos encontrados
                  </span>
                </div>


                <div className="table-responsive">
                  <table className="table table-striped table-hover table-doctor-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Especialidade</th>
                        <th>Email</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicosFiltrados.length > 0 ? (
                        medicosFiltrados.map((medico) => (
                          <tr key={medico.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {medico.full_name}
                                {ehAniversariante(medico.birth_date) && (
                                  <span className="badge anniversary-badge ms-2" title="Aniversariante do dia">
                                    <i className="bi bi-gift"></i>
                                  </span>
                                )}

                              </div>
                            </td>
                            <td>{medico.cpf}</td>
                            <td>
                              <span className="badge specialty-badge">
                                {medico.specialty || 'Não informado'}
                              </span>
                            </td>
                            <td>{medico.email || 'Não informado'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`${medico.id}`}>
                                  <button className="btn btn-sm btn-view">
                                    <i className="bi bi-eye me-1"></i> Ver Detalhes
                                  </button>
                                </Link>

                                <Link to={`${medico.id}/edit`}>
                                  <button className="btn btn-sm btn-edit">
                                    <i className="bi bi-pencil me-1"></i> Editar
                                  </button>
                                </Link>

                                <button
                                  className="btn btn-sm btn-delete"
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
                          <td colSpan="5" className="empty-state">
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