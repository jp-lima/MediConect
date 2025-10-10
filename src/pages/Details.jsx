import React, { useEffect, useState } from "react";
import avatarPlaceholder from '../assets/images/avatar_placeholder.png';
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import API_KEY from "../components/utils/apiKeys";
import {GetPatientByID} from "../components/utils/Functions-Endpoints/Patient"
import { Link } from "react-router-dom";
import { useAuth } from "../components/utils/AuthProvider";


const Details = () => {
  const parametros = useParams();
  const {getAuthorizationHeader, isAuthenticated} = useAuth();
  const [paciente, setPaciente] = useState({});
  const [anexos, setAnexos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const patientID = parametros.id
  
  const Voltar = () => {
   const prefixo = location.pathname.split("/")[1]; 
    navigate(`/${prefixo}/pacientes`);
  }

  useEffect(() => {
    if (!patientID) return;
    console.log(patientID, 'teu id')
    const authHeader = getAuthorizationHeader()

    GetPatientByID(patientID, authHeader)
      .then((data) => {
        console.log(data, "paciente vindo da API");
        setPaciente(data[0]); // supabase retorna array
      })
      .catch((err) => console.error("Erro ao buscar paciente:", err));

   }, [patientID]);

  
  const handleDelete = async (anexoId) => {
    try {
      const response = await fetch(
        `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientID}/anexos/${anexoId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAnexos((prev) => prev.filter((a) => a.id !== anexoId));
      } else {
        console.error("Erro ao deletar anexo");
      }
    } catch (err) {
      console.error("Erro ao deletar anexo:", err);
    }
  };


  

  return (
    <>
    <div className="card p-3 shadow-sm">
      <h3 className="mb-3 text-center">MediConnect</h3>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success me-2" onClick={() => Voltar()}>
            <i className="bi bi-chevron-left"></i> Voltar
          </button>
        
        
        <div className="d-flex mb-3">
          <div className="avatar avatar-xl">
            <img src={avatarPlaceholder} alt="" />
          </div>


          <div className="media-body ms-3 font-extrabold">
            <span>{paciente.full_name || "Nome Completo"}</span>
            <p>{paciente.cpf || "CPF"}</p>
          </div>
        </div>

         <Link to={`edit`}>
            <button className="btn btn-light"  >
              <i className="bi bi-pencil-square"></i> Editar
            </button>
          </Link>
      
      </div>
    </div>

      {/* ------------------ DADOS PESSOAIS ------------------ */}
      <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Dados Pessoais</h5>
      <hr />
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Nome:</label>
          <p>{paciente.full_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Nome social:</label>
          <p>{paciente.social_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Data de nascimento:</label>
          <p>{paciente.birth_date || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Gênero:</label>
          <p>{paciente.sex || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">CPF:</label>
          <p>{paciente.cpf || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">RG:</label>
          <p>{paciente.rg || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Outro documento:</label>
          <p>{paciente.document_type || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Número do documento:</label>
          <p>{paciente.document_number || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Etnia:</label>
          <p>{paciente.ethnicity || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Raça:</label>
          <p>{paciente.race || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Naturalidade:</label>
          <p>{paciente.naturality || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Profissão:</label>
          <p>{paciente.profession || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Nome da Mãe:</label>
          <p>{paciente.mother_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Profissão da mãe:</label>
          <p>{paciente.mother_profession || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Nome do Pai:</label>
          <p>{paciente.father_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Profissão do pai:</label>
          <p>{paciente.father_profession || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Nome do responsável:</label>
          <p>{paciente.guardian_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">CPF do responsável:</label>
          <p>{paciente.guardian_cpf || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Estado civil:</label>
          <p>{paciente.marital_status || "-"}</p>
        </div>
     
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Identificador de outro sistema:</label>
          <p>{paciente.legacy_code || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={paciente.rn_in_insurance} disabled/>
            <label className="font-extrabold">RN na Guia do convênio:</label>
          </div>
        </div>
          <div className="col-md-2 d-flex align-items-end mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={paciente.vip} disabled/>
            <label className="font-extrabold">Paciente VIP: </label>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Observações:</label>
          <p>{paciente.notes || "-"}</p>
        </div>
       
      
      </div>
      </div>

      {/* ------------------ INFORMAÇÕES MÉDICAS ------------------ */}
      <div className="card p-3 shadow-sm">
      <h5>Informações Médicas</h5>
      <hr />
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="font-extrabold">Tipo Sanguíneo:</label>
          <p>{paciente.blood_type || "-"}</p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="font-extrabold">Peso (kg):</label>
          <p>{paciente.weight_kg || "-"}</p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="font-extrabold">Altura (m):</label>
          <p>{paciente.height_m || "-"}</p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="font-extrabold">IMC (kg/m²):</label>
          <p>{paciente.bmi || "-"}</p>
        </div>
      </div>
      </div>

      {/* ------------------ ENDEREÇO ------------------ */}
      <div className="card p-3 shadow-sm">
      <h5>Endereço</h5>
      <hr />
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">CEP:</label>
          <p>{paciente.cep || "-"}</p>
        </div>
        <div className="col-md-8 mb-3">
          <label className="font-extrabold">Rua:</label>
          <p>{paciente.street || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Bairro:</label>
          <p>{paciente.neighborhood || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Cidade:</label>
          <p>{paciente.city || "-"}</p>
        </div>
        <div className="col-md-2 mb-3">
          <label className="font-extrabold">Estado:</label>
          <p>{paciente.state || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Número:</label>
          <p>{paciente.number || "-"}</p>
        </div>
        <div className="col-md-8 mb-3">
          <label className="font-extrabold">Complemento:</label>
          <p>{paciente.complement || "-"}</p>
        </div>
      </div>
      </div>

      {/* ------------------ CONTATO ------------------ */}
      <div className="card p-3 shadow-sm">
      <h5>Contato</h5>
      <hr />
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Email:</label>
          <p>{paciente.email || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Telefone:</label>
          <p>{paciente.phone_mobile || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Telefone 2:</label>
          <p>{paciente.phone1 || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Telefone 3:</label>
          <p>{paciente.phone2 || "-"}</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Details;