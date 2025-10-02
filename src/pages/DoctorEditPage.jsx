import React from 'react'
import { GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor'
import DoctorForm from '../components/doctors/DoctorForm'
import { useAuth } from '../components/utils/AuthProvider'
import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import API_KEY from '../components/utils/apiKeys'
const DoctorEditPage = ( {id, setCurrentPage}) => {
  const {getAuthorizationHeader, isAuthenticated} = useAuth();
  const [DoctorToPUT, setDoctorPUT] = useState({})
  
  const Parametros = useParams()

  const DoctorID = Parametros.id

useEffect(() => {
    
  const authHeader = getAuthorizationHeader()

 GetDoctorByID(DoctorID, authHeader)
      .then((data) => {
        console.log(data, "médico vindo da API");
        setDoctorPUT(data[0])
        ; // supabase retorna array
      })
      .catch((err) => console.error("Erro ao buscar paciente:", err));

    
}, [])
  const HandlePutDoctor = async () => {
const authHeader = getAuthorizationHeader()
  

  var myHeaders = new Headers();
  myHeaders.append('apikey', API_KEY)
  myHeaders.append("Authorization", authHeader);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(DoctorToPUT);

  console.log("Enviando médico para atualização:", DoctorToPUT);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${DoctorID}`,requestOptions);

    // se o backend retorna JSON
    const result = await response.json(); 
    console.log("ATUALIZADO COM SUCESSO", result);
    
    return result; 
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }

  }


  return (
    <div>

    <DoctorForm
    onSave={HandlePutDoctor}
    onCancel={console.log('Não atualizar')}
    formData={DoctorToPUT}
    setFormData={setDoctorPUT}
    
    />
    
    </div>
  )
}

export default DoctorEditPage