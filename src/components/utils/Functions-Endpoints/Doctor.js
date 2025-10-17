import API_KEY from "../apiKeys";



const GetDoctorByID = async (ID,authHeader) => {

  var myHeaders = new Headers();
  myHeaders.append('apikey', API_KEY)
  myHeaders.append('Authorization', authHeader)

  var requestOptions = {
   method: 'GET',
   redirect: 'follow',
   headers:myHeaders
};


const result = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${ID}`, requestOptions)
const DictMedico = await result.json()    
return DictMedico

}

const GetAllDoctors = async (authHeader) => {
    var myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);
  myHeaders.append("Authorization", authHeader);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const result = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions)
  const DictMedicos = await result.json()
  return DictMedicos  
  }


const GetDoctorByName = async (nome, authHeader) => {
  const Medicos = await GetAllDoctors(authHeader)
      
     for (let i = 0; i < Medicos.length; i++) {

         if (Medicos[i].full_name === nome) {
            console.log('Medico encontrado:', Medicos[i]);
             return Medicos[i];
         }
         else{console.log("nada encontrado")}
     }
   

}

export {GetDoctorByID, GetDoctorByName, GetAllDoctors}