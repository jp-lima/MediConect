import API_KEY from "../apiKeys";

  const UserInfos = async (access_token) => {

    let Token = access_token.replace('bearer', 'Bearer')

    
   var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);

    myHeaders.append("Authorization", Token);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    

    const userInfo = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/user-info`, requestOptions)
    const userInfoData = await userInfo.json()
    console.log(userInfoData, "Dados do usuário")
    return userInfoData 
}

const UploadFotoAvatar = ( userID,access_token,file)  => {


}

export {UserInfos}