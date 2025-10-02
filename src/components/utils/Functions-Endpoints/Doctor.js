import API_KEY from "../apiKeys";



const GetDoctorByID = async (ID,authHeader) => {

  console.log(authHeader, 'mostrando autorização dentro da função')

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

export {GetDoctorByID}