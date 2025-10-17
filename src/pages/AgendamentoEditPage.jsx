import React from 'react'
import FormNovaConsulta from '../components/AgendarConsulta/FormNovaConsulta'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'
import dayjs from 'dayjs'


const AgendamentoEditPage = () => {

    let DataAtual = dayjs()
    const {getAuthorizationHeader} = useAuth()
    const params = useParams()
    const [PatientToPatch, setPatientToPatch] = useState({})

    let id = params.id

    console.log(id)

    let authHeader = getAuthorizationHeader() 

    const handleSave = (DictParaPatch) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('apikey', API_KEY)
        myHeaders.append("authorization", authHeader)

        console.log(DictParaPatch)

        var raw = JSON.stringify({"patient_id": DictParaPatch.patient_id,
       "doctor_id": DictParaPatch.doctor_id,
       "scheduled_at": DataAtual,
       "duration_minutes": 30,
       "appointment_type": "presencial",
       "chief_complaint": "Dor de cabeça há 3 ",
       "patient_notes": "Prefiro horário pela manhã",
       "insurance_provider": "Unimed",
       "created_by": "87f2662c-9da7-45c0-9e05-521d9d92d105"

    
        });

        console.log(DictParaPatch)
        console.log(id)

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }


  return (
    <div>
        <FormNovaConsulta onSave={handleSave} agendamento={PatientToPatch} setAgendamento={setPatientToPatch}/>


    </div>
  )
}

export default AgendamentoEditPage
