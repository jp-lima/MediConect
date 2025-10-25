import React from 'react'
import FormNovaConsulta from '../components/AgendarConsulta/FormNovaConsulta'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'
import dayjs from 'dayjs'
import { UserInfos } from '../components/utils/Functions-Endpoints/General'

const AgendamentoEditPage = ({setDictInfo, DictInfo}) => {

    const [idUsuario, setIDusuario] = useState('0')
    //let DataAtual = dayjs()
    const {getAuthorizationHeader} = useAuth()
    const params = useParams()
    const [PatientToPatch, setPatientToPatch] = useState({})

    let id = params.id

    console.log(DictInfo, "DENTRO DO EDITAR")

    //console.log(DictInfo, 'aqui')    

    useEffect(() => {
      setDictInfo({...DictInfo?.Infos,...DictInfo?.agendamento})


        const ColherInfoUsuario =async () => {
          const result = await UserInfos(authHeader)
        
          setIDusuario(result?.profile?.id)
        
        }
        ColherInfoUsuario()
        


    }, [])


    
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

        console.log(DictParaPatch)
        console.log(id)

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
        <FormNovaConsulta onSave={handleSave} agendamento={DictInfo} setAgendamento={setDictInfo}/>


    </div>
  )
}

export default AgendamentoEditPage
