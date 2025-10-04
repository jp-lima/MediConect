import {React, useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserInfos } from './utils/Functions-Endpoints/General';
import { useAuth } from './utils/AuthProvider';
import './Estilo/TrocardePerfis.css'

const TrocardePerfis = () => {
  const location = useLocation();
   
  const [selectedProfile, setSelectedProfile] = useState('');
  const { getAuthorizationHeader } = useAuth();
  const [showProfiles, setShowProfiles] = useState([]);
   const navigate = useNavigate();

  let authHeader = getAuthorizationHeader();
  console.log('AUTH HEADER', authHeader)


const handleProfileClick = (route) => {
 
  navigate(route);
};


useEffect(() => {
  const fetchData = async () => {
    setSelectedProfile(location.pathname);
    const userInfo = await UserInfos(authHeader);
    setShowProfiles(userInfo?.roles || []);
  };

  fetchData();
}, []);

  return (
    
    <div className='container-perfis'>

      <p>Acesso aos modulos:</p>
    <div id='primeiro-conjunto-botoes'>
  {(showProfiles?.includes('secretaria') || showProfiles?.includes('admin')) && (
    <button
      className={`perfil-button${selectedProfile === '/secretaria' ? ' selecionado' : ''}`}
      onClick={() => handleProfileClick('/secretaria')}
    >
      Secretaria
    </button>
  )}
  {(showProfiles?.includes('medico') || showProfiles?.includes('admin')) && (
    <button
      className={`perfil-button${selectedProfile === '/medico' ? ' selecionado' : ''}`}
      onClick={() => handleProfileClick('/medico')}
    >
      Médicos
    </button>
  )}
</div>

<div id='segundo-conjunto-botoes'>
  {(showProfiles?.includes('financeiro') || showProfiles?.includes('admin')) && (
    <button
      className={`perfil-button${selectedProfile === '/financeiro' ? ' selecionado' : ''}`}
      onClick={() => handleProfileClick('/financeiro')}
    >
      Financeiro
    </button>
  )}
  {showProfiles?.includes('admin') && (
    <button

      className={`perfil-button${selectedProfile === '/admin' ? ' selecionado' : ''}`}
      onClick={() => handleProfileClick('/admin')}
    >
      Administração
    </button>
  )}
</div>
    </div>
  )
}

export default TrocardePerfis