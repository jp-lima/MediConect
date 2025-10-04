import React, { useState } from 'react';
import { useAuth } from '../components/utils/AuthProvider';
import DoctorForm from '../components/doctors/DoctorForm';
import API_KEY from '../components/utils/apiKeys';
import { useNavigate, useLocation } from 'react-router-dom';

function DoctorCadastroManager() {
  const [DoctorDict, setDoctorDict] = useState({})
  const navigate = useNavigate();
  const location = useLocation();
  const { getAuthorizationHeader, isAuthenticated } = useAuth();

  const handleSaveDoctor = async (doctorData) => {
    const authHeader = getAuthorizationHeader();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);

    console.log(' Dados recebidos do Form:', doctorData);

    const cleanedData = {
      full_name: doctorData.full_name,
      cpf: doctorData.cpf ? doctorData.cpf.replace(/\D/g, '') : null,
      birth_date: doctorData.birth_date || null,
      email: doctorData.email,
      phone_mobile: doctorData.phone_mobile ? doctorData.phone_mobile.replace(/\D/g, '') : null,
      crm_uf: doctorData.crm_uf,
      crm: doctorData.crm,
      specialty: doctorData.specialty || null,
      cep: doctorData.cep ? doctorData.cep.replace(/\D/g, '') : null,
      street: doctorData.street || null,
      neighborhood: doctorData.neighborhood || null,
      city: doctorData.city || null,
      state: doctorData.state || null,
      number: doctorData.number || null,
      complement: doctorData.complement || null,
      phone2: doctorData.phone2 ? doctorData.phone2.replace(/\D/g, '') : null,
    };

    console.log(' Dados limpos para envio:', cleanedData);

    var raw = JSON.stringify(cleanedData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions);
      
      console.log(" Status da resposta:", response.status);
      console.log(" Response ok:", response.ok);

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error(" Erro detalhado:", errorData);
          errorMessage = errorData.message || errorData.details || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error(" Erro texto:", errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Médico salvo no backend:", result);

      // Redireciona para a lista de médicos do perfil atual
      const prefixo = location.pathname.split("/")[1];
      navigate(`/${prefixo}/medicos`);

      return result;

    } catch (error) {
      console.error(" Erro ao salvar Médico:", error);
      throw error; 
    }
  };

  return (
    <>
      <div className="page-heading">
        <h3>Cadastro de Médicos</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <DoctorForm
              onSave={handleSaveDoctor}
             
              formData={DoctorDict}
              setFormData={setDoctorDict}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default DoctorCadastroManager;