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

  const { getAuthorizationHeader, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({})
 
  // Função que será chamada para "salvar" o paciente
  const handleSavePatient = async (patientData) => {
    const authHeader = getAuthorizationHeader();

    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", API_KEY)
      myHeaders.append("Authorization", authHeader)


    console.log('Salvando paciente:', patientData);

    var raw = JSON.stringify(patientData);
    console.log(patientData, 'aqui')

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    // 23505 - cpf duplicadoo
    // 23514 - cpf invalido
    try {
      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions);
      console.log(response.ok, 'aqui')
    
    if(response.ok === false){
      const data = await response.json();
      console.log("Erro ao salvar paciente:", data);
      if (data.code === "23505") {
        setShowModal(true);
        setInfosModal({
          title: 'Erro ao salvar paciente',
          message: 'CPF já cadastrado. Por favor, verifique o CPF informado.'
        });
      }
    }
    else{
      console.log("ATUALIZADO COM SUCESSO");
      navigate('/pacientes')
    }
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
    throw error;
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
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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
                  Fechar e Continuar no Cadastro
                </button>
               
              </div>
            </div>
          </div>
        </div>)}

        <h3>Cadastro de Pacientes</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12">
              <PatientForm
                onSave={handleSavePatient}
                onCancel={() => {navigate('/secretaria/pacientes')}}
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