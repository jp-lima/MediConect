
import '../PagesMedico/styleMedico/FormNovoRelatorio.css'
import API_KEY from '../components/utils/apiKeys'
import FormRelatorio from '../components/FormRelatorio'
import { useState } from 'react'
import { useAuth } from '../components/utils/AuthProvider'
const FormNovoRelatorio = () => {
  const [DictInfo, setDictInfo] = useState({})

  const {getAuthorizationHeader} = useAuth()
  let authHeader = getAuthorizationHeader()

  const handleSave = (data) => {
    console.log("Relatório salvo:", data);
   
    var myHeaders = new Headers();
myHeaders.append("apikey", API_KEY);
myHeaders.append("Authorization", authHeader);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({...data});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
  }

    return (
        <div>
          <h3>Criar Novo Relatorio</h3>
            <FormRelatorio  DictInfo={DictInfo} setDictInfo={setDictInfo} onSave={handleSave} />
        </div>
    )
}

export default FormNovoRelatorio