import React from 'react'
import "./style.css"
import CardConsultaPaciente from './CardConsultaPaciente'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'

const ConsultasPaciente = ({setConsulta}) => {
  const {getAuthorizationHeader} = useAuth()


  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedID, setSelectedId] = useState("")
  let authHeader = getAuthorizationHeader()

  const [consultas, setConsultas] = useState([])

const FiltrarAgendamentos = (agendamentos, id) => {
    // Verifica se a lista de agendamentos é válida antes de tentar filtrar
    if (!agendamentos || !Array.isArray(agendamentos)) {
        console.error("A lista de agendamentos é inválida.");
        setConsultas([]); // Garante que setConsultas receba uma lista vazia
        return;
    }

    // 1. Filtragem
    // O método .filter() cria uma nova lista contendo apenas os itens que retornarem 'true'
    const consultasFiltradas = agendamentos.filter(agendamento => {
        // A condição: o patient_id do agendamento deve ser estritamente igual ao id fornecido
        // Usamos toString() para garantir a comparação, pois um pode ser number e o outro string
        return agendamento.patient_id && agendamento.patient_id.toString() === id.toString();
    });

    // 2. Adicionar a lista no setConsultas
    console.log(consultasFiltradas)
    setConsultas(consultasFiltradas);
}

// Exemplo de como você chamaria (assumindo que DadosAgendamento é sua lista original):
// FiltrarAgendamentos(DadosAgendamento, Paciente.id);

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
      .then(result => {FiltrarAgendamentos(result, "6e7f8829-0574-42df-9290-8dbb70f75ada" )})
      .catch(error => console.log('error', error));

  }, [])

  const navigate = useNavigate()

  const deleteConsulta= (ID) => {
     var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('apikey', API_KEY)
            myHeaders.append("authorization", authHeader)
    
    
            var raw = JSON.stringify({ "status":"cancelled"      
            });
    
    
            var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
    
            fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${selectedID}`, requestOptions)
            .then(response => {if(response.status !== 200)(console.log(response))})
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    console.log("deletar", ID)
  } 

  return (
    <div>
        <h1> Gerencie suas consultas</h1>

        <div className='form-container'>
      
          <button className="btn btn-primary" onClick={() => {navigate("criar")}}>
             <i className="bi bi-plus-circle"></i> Adicionar Consulta

          </button>

        <h2>Seus proximos atendimentos</h2>

        {consultas.map((consulta) => (
            <CardConsultaPaciente consulta={consulta} setConsulta={setConsulta} setShowDeleteModal={setShowDeleteModal} setSelectedId={ setSelectedId}/>

        ))}
{showDeleteModal &&
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
                  Tem certeza que deseja excluir este agendamento? 
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
                  onClick={() => {deleteConsulta(selectedID);setShowDeleteModal(false)}}  
                  
                >
                  <i className="bi bi-trash me-1"></i> Excluir
                </button>
              </div>
            </div>
          </div>}

    </div>
    </div>
  )
}

export default ConsultasPaciente