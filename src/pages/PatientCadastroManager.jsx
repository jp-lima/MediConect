import {useState} from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/patients/PatientForm';
import API_KEY from '../components/utils/apiKeys';
import { useAuth } from '../components/utils/AuthProvider';

function PatientCadastroManager( {setCurrentPage} ) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [infosModal, setInfosModal] = useState({title:'', message:''});
  const [isLoading, setIsLoading] = useState(false);

  const { getAuthorizationHeader, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({})


  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
   
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }
 
  const handleSavePatient = async (patientData) => {
    console.log(' Iniciando salvamento do paciente:', patientData);
    setIsLoading(true);

    try {

      console.log(' Verificando autenticação...');
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado');
      }

      const authHeader = getAuthorizationHeader();
      console.log(' Header de autorização:', authHeader ? 'Presente' : 'Faltando');
      
      if (!authHeader) {
        throw new Error('Header de autorização não encontrado');
      }


      const cpfLimpo = patientData.cpf.replace(/\D/g, '');
      if (!validarCPF(cpfLimpo)) {
        throw new Error('CPF inválido. Por favor, verifique o número digitado.');
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", API_KEY);
      myHeaders.append("Authorization", authHeader);
      myHeaders.append("Prefer", "return=representation");

      console.log(' Headers configurados:', {
        'Content-Type': 'application/json',
        'apikey': API_KEY ? 'Presente' : 'Faltando',
        'Authorization': authHeader ? 'Presente' : 'Faltando',
        'Prefer': 'return=representation'
      });

      const cleanedData = {
        full_name: patientData.full_name,
        cpf: cpfLimpo,
        email: patientData.email,
        phone_mobile: patientData.phone_mobile,
   
        birth_date: patientData.birth_date || null,
        sex: patientData.sex === 'Masculino' ? 'M' : 
             patientData.sex === 'Feminino' ? 'F' : 
             patientData.sex || null,
        social_name: patientData.social_name || null,
        rg: patientData.rg || null,
        blood_type: patientData.blood_type || null,
        weight_kg: patientData.weight_kg ? parseFloat(patientData.weight_kg) : null,
        height_m: patientData.height_m ? parseFloat(patientData.height_m) : null,
        bmi: patientData.bmi ? parseFloat(patientData.bmi) : null,
        notes: patientData.notes || null,
      };

      console.log(' Dados limpos para envio:', cleanedData);

      if (!cleanedData.full_name || !cleanedData.cpf || !cleanedData.email || !cleanedData.phone_mobile) {
        throw new Error('Dados obrigatórios faltando: nome, CPF, email e telefone são necessários');
      }

      var raw = JSON.stringify(cleanedData);
      console.log(' Payload JSON:', raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      console.log(' Fazendo requisição para API...');
      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions);
      
      console.log(' Status da resposta:', response.status);
      console.log(' Response ok:', response.ok);

      let responseData;
      try {
        responseData = await response.json();
        console.log(' Corpo da resposta:', responseData);
      } catch (jsonError) {
        console.log(' Não foi possível parsear JSON da resposta:', jsonError);
        responseData = { error: 'Resposta inválida da API' };
      }

    
      if (!response.ok) {
        console.error(' Erro da API - Detalhes:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        let errorMessage = 'Erro ao salvar paciente';
        
        if (response.status === 401) {
          errorMessage = 'Não autorizado. Verifique suas credenciais.';
        } else if (response.status === 403) {
          errorMessage = 'Acesso proibido. Verifique suas permissões.';
        } else if (response.status === 409) {
          errorMessage = 'Paciente com este CPF já existe.';
        } else if (response.status === 400) {
          errorMessage = `Dados inválidos: ${responseData.details || responseData.message || 'Verifique os campos'}`;
        } else if (response.status === 422) {
          errorMessage = `Dados de entrada inválidos: ${responseData.details || 'Verifique o formato dos dados'}`;
        } else if (response.status >= 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = `Erro ${response.status}: ${responseData.message || responseData.error || 'Erro desconhecido'}`;
        }
        
        throw new Error(errorMessage);
      }

      console.log(' Paciente salvo com sucesso:', responseData);
      
    
      setInfosModal({
        title: 'Sucesso',
        message: 'O cadastro do paciente foi realizado com sucesso.'
      });
      setShowModal(true);
      
  
      setTimeout(() => {
        setShowModal(false);
        navigate('/secretaria/pacientes');
      }, 2000);
      
    } catch (error) {
      console.error(' Erro completo ao salvar paciente:', error);
      setInfosModal({
        title: 'Erro',
        message: error.message || 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        {showModal &&(
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                width: "400px",
                maxWidth: "90%",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                overflow: "hidden",
              }}
            >

              <div
                style={{
                  backgroundColor: infosModal.title === 'Sucesso' ? "#28a745" : "#dc3545",
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5 style={{ color: "#fff", margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>{infosModal.title}</h5>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>


              <div style={{ padding: "25px 20px" }}>
                <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>
                  {infosModal.message}
                </p>
                {infosModal.title === 'Erro' && (
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "10px 0 0 0" }}>
                  </p>
                )}
              </div>

   
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "15px 20px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (infosModal.title === 'Sucesso') {
                      navigate('/secretaria/pacientes');
                    }
                  }}
                  style={{
                    backgroundColor: "#1e3a8a",
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <h3>Cadastro de Pacientes</h3>
        {isLoading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Salvando paciente...
          </div>
        )}
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <PatientForm
              onSave={handleSavePatient}
              onCancel={() => navigate('/secretaria/pacientes')}
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default PatientCadastroManager;