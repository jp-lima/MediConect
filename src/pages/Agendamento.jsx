import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_KEY from '../components/utils/apiKeys.js';
import AgendamentoCadastroManager from './AgendamentoCadastroManager.jsx';
import TabelaAgendamentoDia from '../components/AgendarConsulta/TabelaAgendamentoDia';
import TabelaAgendamentoSemana from '../components/AgendarConsulta/TabelaAgendamentoSemana';
import TabelaAgendamentoMes from '../components/AgendarConsulta/TabelaAgendamentoMes';
import FormNovaConsulta from '../components/AgendarConsulta/FormNovaConsulta';
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient.js';
import { GetAllDoctors, GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor.js';

import { useAuth } from '../components/utils/AuthProvider.js';
// ✨ NOVO: Caminho de importação corrigido com base na sua estrutura de pastas
import AgendamentosMes from '../components/AgendarConsulta/DadosConsultasMock.js';


import dayjs from 'dayjs';
import "./style/Agendamento.css";
import './style/FilaEspera.css';
import { Search } from 'lucide-react';



const Agendamento = () => {
  const navigate = useNavigate();

  const [filaEsperaData, setfilaEsperaData] = useState([])
    const [FiladeEspera, setFiladeEspera] = useState(false);
  const [tabela, setTabela] = useState('diario');
  const [PageNovaConsulta, setPageConsulta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [agendamentos, setAgendamentos] = useState()
  const {getAuthorizationHeader} = useAuth()
   const [DictAgendamentosOrganizados, setAgendamentosOrganizados ] = useState({})

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [AgendamentoFiltrado, setAgendamentoFiltrado] = useState()
  
  const [ListaDeMedicos, setListaDeMedicos] = useState([])
  const [FiltredTodosMedicos, setFiltredTodosMedicos] = useState([])
  const [searchTermDoctor, setSearchTermDoctor] = useState('');


  let authHeader = getAuthorizationHeader() 

  const FiltrarAgendamentos = async (listaTodosAgendamentos) => {

    const ConfigurarFiladeEspera = async (patient_id, doctor_id, agendamento) => {
  
      
      let medico = await GetDoctorByID(doctor_id, authHeader)
      let paciente = await GetPatientByID(patient_id, authHeader)

      let dicionario = {patientInfo:paciente, doctorInfo:medico, agendamentoInfo:agendamento}
      

      return dicionario

    }

  let DictAgendamentosOrganizados = {};
  let ListaFilaDeEspera = []

  for (let i = 0; i < listaTodosAgendamentos.length; i++) {
    const agendamento = listaTodosAgendamentos[i];
    if(agendamento.status === 'requested'){
      
      let v = await ConfigurarFiladeEspera(agendamento.patient_id, agendamento.doctor_id, agendamento)
      
    ListaFilaDeEspera.push(v)

      console.log(ListaFilaDeEspera)

    }

    else{
    const DiaAgendamento = agendamento.scheduled_at.split("T")[0];

    //console.log(DictAgendamentosOrganizados)

    if (DiaAgendamento in DictAgendamentosOrganizados) {
      // já existe a data → adiciona na lista
      DictAgendamentosOrganizados[DiaAgendamento].push(agendamento);
    } else {
      // não existe → cria nova key com uma lista
      DictAgendamentosOrganizados[DiaAgendamento] = [agendamento];
    }}
  }

  
  setAgendamentosOrganizados(DictAgendamentosOrganizados);
  setfilaEsperaData(ListaFilaDeEspera)

  }

  // Requisição inicial para mostrar os agendamentos do banco de dados
  useEffect(() => {
        var myHeaders = new Headers();
    myHeaders.append("Authorization", authHeader);
    myHeaders.append("apikey", API_KEY)

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?select&doctor_id&patient_id&status&scheduled_at&order&limit&offset", requestOptions)
      .then(response => response.json())
      .then(result => {FiltrarAgendamentos(result);})
      .catch(error => console.log('error', error));

    const PegarTodosOsMedicos = async () => {
      let lista = []
      const TodosOsMedicos = await GetAllDoctors(authHeader)

      for(let d = 0; TodosOsMedicos.length > d; d++){
        lista.push({nomeMedico: TodosOsMedicos[d].full_name, idMedico: TodosOsMedicos[d].id })}
      setListaDeMedicos(lista)
    }
    PegarTodosOsMedicos()

  }, [])

 useEffect(() => {
      console.log("mudou FiltredTodosMedicos:", FiltredTodosMedicos);
   if (FiltredTodosMedicos.length === 1) {  
      const unicoMedico = FiltredTodosMedicos[0]; 
      console.log(unicoMedico)
      const idMedicoFiltrado = unicoMedico.idMedico;    
      console.log(`Médico único encontrado: ${unicoMedico.nomeMedico}. ID: ${idMedicoFiltrado}`);
      
      const agendamentosDoMedico = filtrarAgendamentosPorMedico(
          DictAgendamentosOrganizados, 
          idMedicoFiltrado
      );      
      console.log(`Total de agendamentos filtrados para este médico: ${agendamentosDoMedico.length}`);
      console.log("Lista completa de Agendamentos do Médico:", agendamentosDoMedico);
      FiltrarAgendamentos(agendamentosDoMedico)
      
    } 
  }, [FiltredTodosMedicos]); 



/**
 * Filtra todos os agendamentos em um objeto aninhado (data -> [agendamentos]) 
 * com base no ID do médico.
 *
 * @param {Object} dictAgendamentos - O dicionário de agendamentos.
 * @param {string} idMedicoFiltrado - O ID do médico (doctor_id) para ser usado como filtro.
 * @returns {Array} Um array contendo todos os agendamentos que correspondem ao idMedicoFiltrado.
 */
const filtrarAgendamentosPorMedico = (dictAgendamentos, idMedicoFiltrado) => { 
    
    // O corpo da função deve usar esses nomes de variáveis:
    const todasAsListasDeAgendamentos = Object.values(dictAgendamentos);
    
    const todosOsAgendamentos = todasAsListasDeAgendamentos.flat();

    const agendamentosFiltrados = todosOsAgendamentos.filter(agendamento => 
        agendamento.doctor_id === idMedicoFiltrado
    );

    return agendamentosFiltrados;
};

 

  // Lógica para filtrar os dados da AGENDA (AgendamentosMes)
  const filteredAgendamentos = useMemo(() => {
    if (!searchTerm.trim()) {
      return AgendamentosMes;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredData = {};

    for (const semana in AgendamentosMes) {
      filteredData[semana] = {};
      for (const dia in AgendamentosMes[semana]) {
        filteredData[semana][dia] = AgendamentosMes[semana][dia].filter(agendamento =>
          agendamento.status === 'vazio' ||
          (agendamento.paciente && agendamento.paciente.toLowerCase().includes(lowerCaseSearchTerm))
        );
      }
    }
    return filteredData;
  }, [searchTerm]);

  const ListarDiasdoMes = (ano, mes) => {
    let segundas = []; let tercas = []; let quartas = []; let quintas = []; let sextas = []
    const base = dayjs(`${ano}-${mes}-01`)
    const DiasnoMes = base.daysInMonth()
    for (let d = 1; d <= DiasnoMes; d++) {
      const data = dayjs(`${ano}-${mes}-${d}`)
      const dia = data.format('dddd')
      switch (dia) {
        case 'Monday': segundas.push(d); break
        case 'Tuesday': tercas.push(d); break
        case 'Wednesday': quartas.push(d); break
        case 'Thursday': quintas.push(d); break
        case 'Friday': sextas.push(d); break
        default: break
      }
    }
    let ListaDiasDatas = {segundas:segundas,tercas:tercas,quartas: quartas,quintas: quintas,sextas: sextas}
    return ListaDiasDatas
  }

  const handleClickAgendamento = (agendamento) => {
    if (agendamento.status !== 'vazio') return
    else setPageConsulta(true)
};


const handleSearchMedicos = (term) => {
    setSearchTermDoctor(term);
    if (term.trim() === '') {
        setFiltredTodosMedicos([]);
        return;
    }
    
    // Lógica simples de filtragem:
    const filtered = ListaDeMedicos.filter(medico => 
        medico.nomeMedico.toLowerCase().includes(term.toLowerCase())
    );
    setFiltredTodosMedicos(filtered);
};
  

  const handleClickCancel = () => setPageConsulta(false)

  return (
    <div>
      <h1>Agendar nova consulta</h1>

      <button onClick={() => setPageConsulta(true)}>
        Ir para Formulário de Disponibilidade
      </button>

      {!PageNovaConsulta ? (
        <div className='atendimento-eprocura'>
          
          <div className='busca-atendimento-container'> 
        
        <div className='input-e-dropdown-wrapper'>

          <div className='busca-atendimento'>
              <div>
                  <i className="fa-solid fa-calendar-day"></i>
                  <input
                      type="text"
                      placeholder="Filtrar atendimento por médico..."
                      value={searchTermDoctor}
                      onChange={(e) => handleSearchMedicos(e.target.value)} // Chama a nova função de filtro
                  />
              </div>
          </div>
          
          {/* DROPDOWN (RENDERIZAÇÃO CONDICIONAL) */}
            {searchTermDoctor && FiltredTodosMedicos.length > 0 && (
              <div className='dropdown-medicos'>
                  {FiltredTodosMedicos.map((medico) => (
                      <div 
                          key={medico.id} 
                          className='dropdown-item'
                          onClick={() => {
                              // Ação ao selecionar o médico
                              setSearchTermDoctor(medico.nomeMedico); // Preenche o input
                              //setFiltredTodosMedicos([]); // Fecha o dropdown
                              // Lógica adicional, como selecionar o ID do médico...
                          }}
                      >
                          <p>{medico.nomeMedico} </p>
                      </div>
                  ))}
              </div>
             )}
        </div>
    </div>


          <div className='unidade-selecionarprofissional'>
            <select>
              <option value="" disabled selected >Unidade</option>
              <option value="">Unidade Central</option>
              <option value="">Unidade Zona Norte</option>
              <option value="">Unidade Zona Oeste</option>
            </select>
            <input type="text" placeholder='Selecionar profissional' />
          </div>

          <div className='container-btns-agenda-fila_esepera'>
            <button
              className={`btn-agenda ${FiladeEspera === false ? "opc-agenda-ativo" : ""}`}
              onClick={() => {
                setFiladeEspera(false);
                setSearchTerm('');
              }}
            >
              Agenda
            </button>
            <button
              className={`btn-fila-espera ${FiladeEspera === true ? "opc-filaespera-ativo" : ""}`}
              onClick={() => {
                setFiladeEspera(true);
                setSearchTerm('');
              }}
            >
              Fila de espera
            </button>
          </div>

          <section className='calendario-ou-filaespera'>
            {FiladeEspera === false ?
              (
                <div className='calendario'>
                  <div>
                    <section className='btns-e-legenda-container'>
                      <div>
                        <button className={`btn-selecionar-tabeladia ${tabela === "diario" ? "ativo" : ""}`} onClick={() => setTabela("diario")}>
                          <i className="fa-solid fa-calendar-day"></i> Dia
                        </button>
                        <button className={`btn-selecionar-tabelasemana ${tabela === 'semanal' ? 'ativo' : ""}`} onClick={() => setTabela("semanal")}>
                          <i className="fa-solid fa-calendar-day"></i> Semana
                        </button>
                        <button className={`btn-selecionar-tabelames ${tabela === 'mensal' ? 'ativo' : ''}`} onClick={() => setTabela("mensal")}>
                          <i className="fa-solid fa-calendar-day"></i> Mês
                        </button>
                      </div>
                      <div className='legenda-tabela'>
                        <div className='legenda-item-realizado'><span>Realizado</span></div>
                        <div className='legenda-item-confirmado'><span>Confirmado</span></div>
                        <div className='legenda-item-agendado'><span>Agendado</span></div>
                        <div className='legenda-item-cancelado'><span>Cancelado</span></div>
                      </div>
                    </section>
                    
                    {tabela === "diario" && <TabelaAgendamentoDia handleClickAgendamento={handleClickAgendamento} agendamentos={DictAgendamentosOrganizados} setShowDeleteModal={setShowDeleteModal} />}
                    {tabela === 'semanal' && <TabelaAgendamentoSemana agendamentos={DictAgendamentosOrganizados} ListarDiasdoMes={ListarDiasdoMes}/>}
                    {tabela === 'mensal' && <TabelaAgendamentoMes ListarDiasdoMes={ListarDiasdoMes} aplicarCores={true} agendamentos={DictAgendamentosOrganizados} />}
                  </div>
                </div>
              )
              :
              (
                <div className="fila-container">
                  <div className="fila-header">
                    <input
                      type="text"
                      placeholder="Pesquisar na fila de espera..."
                      className="busca-fila-espera"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <h2 className="fila-titulo">Fila de Espera</h2>
                  </div>
                  <table className="fila-tabela">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Entrou na fila de espera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filaEsperaData.map((item, index) => (
                        <tr key={index}>
                          <td> <p>{item.patientInfo[0].full_name} </p>  </td>
                          <td>{}</td>
                          <td>{}</td>
                          <td>{}</td>
                          <td>{}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </section>
        </div>
      ) : (
        <AgendamentoCadastroManager />
      )}

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
                  //onClick={() => deletePatient(selectedPatientId)}
                >
                  <i className="bi bi-trash me-1"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        </div>)}

      
    </div>
  )
}

export default Agendamento;