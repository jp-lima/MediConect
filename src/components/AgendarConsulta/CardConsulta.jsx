import React, { useState, useEffect } from 'react';import { GetDoctorByID } from '../utils/Functions-Endpoints/Doctor';
import { GetPatientByID } from '../utils/Functions-Endpoints/Patient';
import { useAuth } from '../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import "./style/card-consulta.css"
const CardConsulta = ( {DadosConsulta, TabelaAgendamento, setShowDeleteModal, setDictInfo, setSelectedId} ) => {
  const navigate = useNavigate();

  const {getAuthorizationHeader} = useAuth()
  const authHeader = getAuthorizationHeader()
  const [Paciente, setPaciente] = useState()
  const [Medico, setMedico] = useState()

  const ids = useMemo(() => {
    return {
      doctor_id: DadosConsulta?.doctor_id,
      patient_id: DadosConsulta?.patient_id,
      status: DadosConsulta?.status
    };
  }, [DadosConsulta]);
   
  
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

  let nameArrayPaciente = Paciente?.full_name.split(' ')

  let nameArrayMedico = Medico?.full_name.split(' ')

  console.log(DadosConsulta.status)

  return (
    <div className={`container-cardconsulta container-cardconsulta-${TabelaAgendamento}`}>

      {DadosConsulta.id?
      
      <div className='cardconsulta' id={`status-card-consulta-${DadosConsulta.status}`}> 

      <div>
        <section className='cardconsulta-infosecundaria'>
          <p>{DadosConsulta.horario} {nameArrayMedico && nameArrayMedico.length > 0 ? nameArrayMedico[0] : ''} {nameArrayMedico && nameArrayMedico.length > 1 ? ` ${nameArrayMedico[1]}` : ''} </p>
        </section>

        <section className='cardconsulta-infoprimaria'>
          
          <p>{nameArrayPaciente && nameArrayPaciente.length > 0 ? nameArrayPaciente[0] : ''} {nameArrayPaciente && nameArrayPaciente.length > 1 ? ` ${nameArrayPaciente[1]}` : ''}- {}</p>
        </section>
      </div>

      <div className='actions-container'>        
        <button className="btn btn-sm btn-edit-custom"
            
            onClick={() => {navigate(`2/edit`)
                setDictInfo({...DadosConsulta,paciente_cpf:Paciente.cpf, paciente_nome:Paciente.full_name, nome_medico:Medico.full_name})
            }}

          >
            <i className="bi bi-pencil me-1"></i>
          </button>           
            <button
              className="btn btn-sm btn-delete-custom-style "
                            onClick={() => {
                console.log(DadosConsulta.id)
                setSelectedId(DadosConsulta.id);
               setShowDeleteModal(true);
              }}
            >
              <i className="bi bi-trash me-1"></i>
            </button>
        </div>

      </div>
      : 
     null
      
        }


    </div>
  )
}

export default CardConsulta