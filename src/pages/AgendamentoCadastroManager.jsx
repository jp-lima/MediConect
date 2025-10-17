import React from 'react'
import FormNovaConsulta from '../components/AgendarConsulta/FormNovaConsulta'
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'
import { useState } from 'react'
import dayjs from 'dayjs'

const AgendamentoCadastroManager = () => {

    const {getAuthorizationHeader} = useAuth()
    const [agendamento, setAgendamento] = useState({})


  let authHeader = getAuthorizationHeader() 

      const handleSave = (Dict) => {
        let DataAtual = dayjs()
        var myHeaders = new Headers();
        myHeaders.append("apikey", API_KEY);
        myHeaders.append("Authorization", authHeader);
        myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
       "patient_id": Dict.patient_id,
       "doctor_id": Dict.doctor_id,
       "scheduled_at": DataAtual,
       "duration_minutes": 30,
       "appointment_type": "presencial",
       "chief_complaint": "Dor de cabeça há 3 ",
       "patient_notes": "Prefiro horário pela manhã",
       "insurance_provider": "Unimed",
       "created_by": "87f2662c-9da7-45c0-9e05-521d9d92d105"
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

    <FormNovaConsulta onSave={handleSave} agendamento={agendamento} setAgendamento={setAgendamento}/>

    </div>
  )
}

export default AgendamentoCadastroManager