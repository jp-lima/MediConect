import React, { useState } from 'react';
import { useAuth } from '../components/utils/AuthProvider';
import DoctorForm from '../components/doctors/DoctorForm';
import API_KEY from '../components/utils/apiKeys';
import { useNavigate, useLocation } from 'react-router-dom';

function DoctorCadastroManager() {
  const [doctorData, setDoctorData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { getAuthorizationHeader, isAuthenticated } = useAuth();

  const handleSaveDoctor = async (doctorData) => {
    setIsLoading(true);
    const authHeader = getAuthorizationHeader();

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", API_KEY);
      myHeaders.append("Authorization", authHeader);

      console.log('Dados recebidos do Form:', doctorData);

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

      console.log('Dados limpos para envio:', cleanedData);

      var raw = JSON.stringify(cleanedData);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions);
      
      console.log("Status da resposta:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        let errorMessage = `Erro ao salvar médico (${response.status})`;
        
   
        const responseText = await response.text();
        console.log("Conteúdo da resposta:", responseText);
        
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            console.error("Erro detalhado:", errorData);
            errorMessage = errorData.message || errorData.details || errorMessage;
          } catch (jsonError) {
      
            errorMessage = responseText || errorMessage;
          }
        } else {
          errorMessage = `Resposta vazia do servidor (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      let result = null;
      
      if (responseText) {
        try {
          result = JSON.parse(responseText);
          console.log("Médico salvo no backend:", result);
        } catch (jsonError) {
          console.warn("Resposta não é JSON válido, mas request foi bem-sucedido");
          result = { success: true, status: response.status };
        }
      } else {
        console.log("Resposta vazia - assumindo sucesso");
        result = { success: true, status: response.status };
      }

  
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Erro ao salvar Médico:", error);
      
      let userFriendlyMessage = error.message;
      
      if (error.message.includes('doctors_cpf_key') || error.message.includes('duplicate key')) {
        userFriendlyMessage = 'Já existe um médico cadastrado com este CPF. Verifique os dados ou edite o médico existente.';
      } else if (error.message.includes('Unexpected end of JSON input')) {
        userFriendlyMessage = 'Erro de comunicação com o servidor. Tente novamente.';
      }
      
      setErrorMessage(userFriendlyMessage);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
 
    const prefixo = location.pathname.split("/")[1];
    navigate(`/${prefixo}/medicos`);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>

      {showSuccessModal && (
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
                backgroundColor: "#28a745",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: "#fff", margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>Sucesso</h5>
              <button
                onClick={handleCloseSuccessModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "25px 20px" }}>
              <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>
                Médico cadastrado com sucesso!
              </p>
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
                onClick={handleCloseSuccessModal}
                style={{
                  backgroundColor: "#28a745",
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

  
      {showErrorModal && (
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
                backgroundColor: "#dc3545",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: "#fff", margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>Erro</h5>
              <button
                onClick={handleCloseErrorModal}
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
                {errorMessage}
              </p>
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
                onClick={handleCloseErrorModal}
                style={{
                  backgroundColor: "#dc3545",
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

      <div className="page-heading">
        <h3>Cadastro de Médicos</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <DoctorForm
              onSave={handleSaveDoctor}
              formData={doctorData}
              setFormData={setDoctorData}
              isLoading={isLoading}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default DoctorCadastroManager;