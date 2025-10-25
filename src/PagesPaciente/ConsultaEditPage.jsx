import React from 'react'
import { useAuth } from '../components/utils/AuthProvider'
import { useState, useEffect } from 'react'
import API_KEY from '../components/utils/apiKeys'
import { UserInfos } from '../components/utils/Functions-Endpoints/General'
import FormConsultaPaciente from './FormConsultaPaciente'

import { GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor'
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient'
const ConsultaEditPage = ({dadosConsulta}) => {

    console.log(dadosConsulta, "editar")

      const {getAuthorizationHeader} = useAuth()
        
        const [idUsuario, setIDusuario] = useState("6e7f8829-0574-42df-9290-8dbb70f75ada")

        const [DictInfo, setDict] = useState({})

        const [Medico, setMedico] = useState({})

        const [Paciente, setPaciente] = useState([])

        useEffect(() => {
          setDict({...dadosConsulta})
    
            const fetchMedicoePaciente = async () => {
                console.log(dadosConsulta.doctor_id)

                let Medico = await GetDoctorByID(dadosConsulta.doctor_id,authHeader )

                let Paciente = await GetPatientByID(dadosConsulta.patient_id,authHeader )

                console.log(Paciente, 'Paciente')
                

                setMedico(Medico[0])
                setPaciente(Paciente[0])


            }
            const ColherInfoUsuario =async () => {
              const result = await UserInfos(authHeader)
            
              setIDusuario(result?.profile?.id)
            
            }
            ColherInfoUsuario()
            fetchMedicoePaciente()
    
    
        }, [])

        useEffect(() => {
            setDict({...DictInfo, medico_nome:Medico?.full_name, dataAtendimento:dadosConsulta.scheduled_at?.split("T")[0]})
        }, [Medico])
    
    
        
        let authHeader = getAuthorizationHeader() 
    
        const handleSave = (DictParaPatch) => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('apikey', API_KEY)
            myHeaders.append("authorization", authHeader)
    
            console.log(DictParaPatch)
    
            var raw = JSON.stringify({"patient_id": DictParaPatch.patient_id,
           "doctor_id": DictParaPatch.doctor_id,
           
           "duration_minutes": 30,
        
           "chief_complaint": "Dor de cabeça há 3 ",
           
           "created_by": idUsuario,
    
            "scheduled_at": `${DictParaPatch.dataAtendimento}T${DictParaPatch.horarioInicio}:00.000Z`,
           
           "appointment_type": DictParaPatch.tipo_consulta,
           
           "patient_notes": "Prefiro horário pela manhã",
           "insurance_provider": DictParaPatch.convenio,
           "status": DictParaPatch.status,
           "created_by": idUsuario
    
        
            });
    
    
            var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
    
            fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${DictInfo.id}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
    
  return (
    <div>
        <FormConsultaPaciente agendamento={DictInfo} setAgendamento={setDict} onSave={handleSave}/>
    </div>
  )
}

export default ConsultaEditPage