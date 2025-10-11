import React from 'react'

import PatientForm from '../components/patients/PatientForm'

import {useEffect, useState} from 'react'
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient'
import API_KEY from '../components/utils/apiKeys'
import {useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/utils/AuthProvider'
const EditPage = () => {
  const navigate = useNavigate()
  const Parametros = useParams()
  const [PatientToPUT, setPatientPUT] = useState({})

   const { getAuthorizationHeader, isAuthenticated } = useAuth();

const PatientID = Parametros.id

useEffect(() => {
   const authHeader = getAuthorizationHeader()

   GetPatientByID(PatientID, authHeader)
  .then((data) => {
        console.log(data[0], "paciente vindo da API");
        setPatientPUT(data[0]); // supabase retorna array
      })
      .catch((err) => console.error("Erro ao buscar paciente:", err));


    
}, [PatientID])

const HandlePutPatient = async () => { 
  const authHeader = getAuthorizationHeader()
  

  var myHeaders = new Headers();
  myHeaders.append('apikey', API_KEY)
  myHeaders.append("Authorization", authHeader);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(PatientToPUT);

  console.log("Enviando paciente para atualização:", PatientToPUT);

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${PatientID}`,requestOptions); 
    console.log(response)   
  
   
    if(response.ok === false){
      console.error("Erro ao atualizar paciente:");
    }
    else{
      console.log("ATUALIZADO COM SUCESSO");
      navigate('/secretaria/pacientes')
    }

    return response;
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }

  
};

  return (
    <div>

    <PatientForm
    onSave={HandlePutPatient}
    
    formData={PatientToPUT}
    setFormData={setPatientPUT}
    />
    
    </div>
  )
}

export default EditPage