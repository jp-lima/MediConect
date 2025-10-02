import React, { useState } from 'react';

// Importamos os dois novos componentes que criamos
import { useAuth } from '../components/utils/AuthProvider';
import DoctorForm from '../components/doctors/DoctorForm';
import API_KEY from '../components/utils/apiKeys';
import { Navigate, useNavigate } from 'react-router-dom';


function DoctorCadastroManager( ) {
  const [DoctorDict, setDoctorDict] = useState({})
  const navigate = useNavigate();

   const { getAuthorizationHeader, isAuthenticated } = useAuth();
  
  // Estado do modal de sucesso
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // Função que será chamada para salvar o médico no banco de dados
  const handleSaveDoctor = async (doctorData) => {
    const authHeader = getAuthorizationHeader();


    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", API_KEY)
      myHeaders.append("Authorization", authHeader)


    console.log('Salvando paciente:', doctorData);

    var raw = JSON.stringify(doctorData);
    console.log(doctorData, 'aqui')

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1//doctors", requestOptions);
       
      console.log("Médico salvo no backend:", response);

      return response;
    } catch (error) {
      console.error("Erro ao salvar Médico:", error);
      throw error; 
    }
};

  return (
    <>
      {/* Modal de feedback */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sucesso</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{modalMsg}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Fechar</button>
              </div>
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
                onCancel={() => {navigate('/medicos')}}
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