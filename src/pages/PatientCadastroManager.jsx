import {useState} from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientForm from '../components/patients/PatientForm';
import API_KEY from '../components/utils/apiKeys';
import { useAuth } from '../components/utils/AuthProvider';

function PatientCadastroManager( {setCurrentPage} ) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [infosModal, setInfosModal] = useState({title:'', message:''});

  const { getAuthorizationHeader, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({})
 
  const handleSavePatient = async (patientData) => {
    console.log('🔄 Iniciando salvamento do paciente:', patientData);

    try {
      const authHeader = getAuthorizationHeader();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", API_KEY);
      myHeaders.append("Authorization", authHeader);

      const cleanedData = {
        full_name: patientData.full_name,
        cpf: patientData.cpf.replace(/\D/g, ''),
        birth_date: patientData.birth_date,
        sex: patientData.sex,
        email: patientData.email,
        phone_mobile: patientData.phone_mobile,
        social_name: patientData.social_name || null,
        rg: patientData.rg || null,
        blood_type: patientData.blood_type || null,
        weight_kg: patientData.weight_kg ? parseFloat(patientData.weight_kg) : null,
        height_m: patientData.height_m ? parseFloat(patientData.height_m) : null,
        bmi: patientData.bmi ? parseFloat(patientData.bmi) : null,
        notes: patientData.notes || null,
      };

      console.log('📤 Dados limpos para envio:', cleanedData);

      var raw = JSON.stringify(cleanedData);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions);
      
      console.log('📨 Status da resposta:', response.status);
      console.log(' Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.details || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Paciente salvo no backend:", result);

      // Redireciona para a lista de pacientes do perfil atual
      const prefixo = location.pathname.split("/")[1];
      navigate(`/${prefixo}/pacientes`);

      return result;

    } catch (error) {
      console.error(error);
      setInfosModal({
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      });
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="page-heading">
        {showModal &&(
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">{infosModal.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{infosModal.message}</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => setShowModal(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <h3>Cadastro de Pacientes</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
            <PatientForm
              onSave={handleSavePatient}
              
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default PatientCadastroManager;