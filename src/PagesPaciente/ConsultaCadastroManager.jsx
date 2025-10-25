import React from 'react'
import FormConsultaPaciente from './FormConsultaPaciente'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/utils/AuthProvider'
import API_KEY from '../components/utils/apiKeys'

import dayjs from 'dayjs'
import { UserInfos } from '../components/utils/Functions-Endpoints/General'
const ConsultaCadastroManager = () => {
    
    const {getAuthorizationHeader} = useAuth()
    const [Dict, setDict] = useState({})
    const navigate = useNavigate()
    const [idUsuario, setIDusuario] = useState("")  
    
      let authHeader = getAuthorizationHeader() 
    

  useEffect(() => {
    const ColherInfoUsuario =async () => {
      const result = await UserInfos(authHeader)
    
      setIDusuario(result?.profile?.id)
    
    }
    ColherInfoUsuario()
    

  }, [])

      const handleSave = (Dict) => {
        let DataAtual = dayjs()
        var myHeaders = new Headers();
        myHeaders.append("apikey", API_KEY);
        myHeaders.append("Authorization", authHeader);
        myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
       "patient_id": Dict.patient_id,
       "doctor_id": Dict.doctor_id,
       "scheduled_at": `${Dict.dataAtendimento}T${Dict.horarioInicio}:00.000Z`,
       "duration_minutes": 30,
       "appointment_type": Dict.tipo_consulta,
       
       "patient_notes": "Prefiro horário pela manhã",
       "insurance_provider": Dict.convenio,
       "status": Dict.status,
       "created_by": idUsuario
    });
    
    var requestOptions = {
       method: 'POST',
       headers: myHeaders,
       body: raw,
       redirect: 'follow'
    };
    
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments", requestOptions)
       .then(response => response.text())
       .then(result => console.log(result))
       .catch(error => console.log('error', error));
    
      }


    
  
  
  
    return (



    <div>
        <FormConsultaPaciente agendamento={Dict} setAgendamento={setDict} onSave={handleSave} onCancel={() => navigate("/paciente/agendamento/")}/>
    </div>
  )
}

export default ConsultaCadastroManager