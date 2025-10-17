import API_KEY from "../apiKeys";



const GetPatientByID = async (ID,authHeader) => {

  var myHeaders = new Headers();
  myHeaders.append('apikey', API_KEY)
  myHeaders.append('Authorization', authHeader)

  var requestOptions = {
   method: 'GET',
   redirect: 'follow',
   headers:myHeaders
};


const result = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${ID}`, requestOptions)
const DictPaciente = await result.json()    
return DictPaciente
}

const GetAllPatients = async (authHeader) => {
    var myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);
  myHeaders.append("Authorization", authHeader);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const result = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions)
  const DictPacientes = await result.json()
  return DictPacientes  
  }

  const GetPatientByCPF = async (cpf, authHeader) => {
   const Pacientes = await GetAllPatients(authHeader)
  
    
   for (let i = 0; i < Pacientes.length; i++) {
       if (Pacientes[i].cpf === cpf) {
          console.log('Paciente encontrado:', Pacientes[i]);
           return Pacientes[i];
       }
       else{console.log("nada encontrado")}
   }
 
  }

export {GetPatientByID, GetAllPatients, GetPatientByCPF}