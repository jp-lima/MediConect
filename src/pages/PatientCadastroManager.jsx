import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/patients/PatientForm';
import API_KEY from '../components/utils/apiKeys';
import { useAuth } from '../components/utils/AuthProvider';
import './style/PatientCadastroManager.css';

function PatientCadastroManager({ setCurrentPage }) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [infosModal, setInfosModal] = useState({ title: '', message: '' });
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
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  const handleSavePatient = async (patientData) => {
    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado');
      }

      const authHeader = getAuthorizationHeader();

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
        mother_name: patientData.mother_name || null,
        father_name: patientData.father_name || null,
        guardian_name: patientData.guardian_name || null,
        guardian_cpf: patientData.guardian_cpf ? patientData.guardian_cpf.replace(/\D/g, '') : null,
        marital_status: patientData.marital_status || null,
        profession: patientData.profession || null,
        naturality: patientData.naturality || null,
        nationality: patientData.nationality || null,
        race: patientData.race || null,
        cep: patientData.cep || null,
        street: patientData.street || null,
        number: patientData.number || null,
        complement: patientData.complement || null,
        neighborhood: patientData.neighborhood || null,
        city: patientData.city || null,
        state: patientData.state || null,
        phone1: patientData.phone1 || null,
        phone2: patientData.phone2 || null
      };

      if (!cleanedData.full_name || !cleanedData.cpf || !cleanedData.email || !cleanedData.phone_mobile) {
        throw new Error('Dados obrigatórios faltando: nome, CPF, email e telefone são necessários');
      }

      var raw = JSON.stringify(cleanedData);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients", requestOptions);

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseData = { error: 'Resposta inválida da API' };
      }

      if (!response.ok) {
        let errorMessage = 'Erro ao salvar paciente';

        if (response.status === 401) {
          errorMessage = 'Não autorizado. Verifique suas credenciais.';
        } else if (response.status === 403) {
          errorMessage = 'Acesso proibido. Verifique suas permissões.';
        } else if (response.status === 409) {
          errorMessage = 'Já existe um paciente cadastrado com este CPF.';
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
        {showModal && (
          <div className="modal-overlay fade-in">
            <div className="modal-content slide-in">
              <div className={`modal-header ${infosModal.title === 'Sucesso' ? 'success' : 'error'}`}>
                <h5>{infosModal.title}</h5>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close-button"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <p className="modal-message">
                  {infosModal.message}
                </p>
                {infosModal.title === 'Erro' && (
                  <p className="modal-submessage">
                  </p>
                )}
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (infosModal.title === 'Sucesso') {
                      navigate('/secretaria/pacientes');
                    }
                  }}
                  className={`modal-confirm-button ${infosModal.title === 'Sucesso' ? 'success' : 'error'}`}
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