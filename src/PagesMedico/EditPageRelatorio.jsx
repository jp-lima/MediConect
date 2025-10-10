import React, { useEffect, useState } from 'react'
import FormRelatorio from '../components/FormRelatorio'
import { useParams } from 'react-router-dom'
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'
const EditPageRelatorio = () => {
  const params = useParams()
  const {getAuthorizationHeader} = useAuth()
  let authHeader = getAuthorizationHeader()
  const [DictInfo, setDictInfo] = useState({}) 

  let RelatorioID = params.id

  const handleSave = (RelatorioInfos) => {
     var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({...RelatorioInfos, order_number:'REL-2025-4386'})

    console.log(RelatorioInfos)

  var requestOptions = {
   method: 'PATCH',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
   
};

    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${RelatorioID}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

  }

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${RelatorioID}`, requestOptions)
      .then(response => response.json())
      .then(result => setDictInfo(result[0]))
      .catch(error => console.log('error', error));
    }, [])

  console.log(RelatorioID)

  return (
    <div>
      <FormRelatorio DictInfo={DictInfo} setDictInfo={setDictInfo} onSave={handleSave}/>
    </div>
  )
}

export default EditPageRelatorio