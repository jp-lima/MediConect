import React from 'react'
import { useEffect, useMemo,useState } from 'react'
import { GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor'
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient'
import { useAuth } from '../components/utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
const CardConsultaPaciente = ({consulta, setConsulta,  setSelectedId, setShowDeleteModal}) => {

  const navigate = useNavigate()
    const [Paciente, setPaciente] = useState({})
    const [Medico, setMedico] = useState({})
    const {getAuthorizationHeader} = useAuth()
    const authHeader = getAuthorizationHeader()
    

    

     const ids = useMemo(() => {
    return {
      doctor_id: consulta?.doctor_id,
      patient_id: consulta?.patient_id,
      status: consulta?.status
    };
  }, [consulta]);
   
  
   useEffect(() => {
    const BuscarMedicoEPaciente = async () => {
      if (!ids.doctor_id || !ids.patient_id || ids.status === 'nada') return;

      try {
        const [Doctor, Patient] = await Promise.all([
          GetDoctorByID(ids.doctor_id, authHeader),
          GetPatientByID(ids.patient_id, authHeader)
        ]);

        setMedico(Doctor?.[0] || null);
        setPaciente(Patient?.[0] || null);
      } catch (error) {
        console.error('Erro ao buscar médico/paciente:', error);
      }
    };

    BuscarMedicoEPaciente();
  }, [ids, authHeader]);



    console.log(consulta, "dento do card")

    let horario = consulta.scheduled_at.split("T")[1]
    let Data = consulta.scheduled_at.split("T")[0]

    console.log(horario)

  const deleteConsulta = () => {}

  return (
   <div class="card-consulta">
    <div class="horario-container">
     
        <span class="horario">
               {`${Data?.split("-")[2]}/${Data?.split("-")[1]}`}
        </span>
    </div>
    <div class="info-container">
        
        <p>{`Inicio: ${horario.split(":")[0]}:${horario.split(":")[1]}`}</p>
        
        <p class="informacao">
          
            Dr {Medico?.full_name} - {Medico?.specialty} 
        </p>

       
         <div className='actions-container'>        
        <button className="btn btn-sm btn-edit-custom"
            
           onClick={() => {navigate(`edit`)
                setConsulta({...consulta,paciente_cpf:Paciente.cpf, paciente_nome:Paciente.full_name, nome_medico:Medico.full_name})
            }}

          >
            <i className="bi bi-pencil me-1"></i>
          </button>           
            <button
              className="btn btn-sm btn-delete-custom-style "
                            onClick={() => {
                console.log(consulta.id)
                 setSelectedId(consulta.id)
                
               setShowDeleteModal(true);
              }}
            >
              <i className="bi bi-trash me-1"></i>
            </button>
        </div>
    </div>
     

</div>
  )
}

export default CardConsultaPaciente