import React, { useEffect, useState } from "react";
import avatarPlaceholder from '../assets/images/avatar_placeholder.png';
import { useParams,Link } from "react-router-dom";
import { GetDoctorByID } from "../components/utils/Functions-Endpoints/Doctor";
import { useAuth } from "../components/utils/AuthProvider";

const Details = ({setCurrentPage }) => {
  const {getAuthorizationHeader, isAuthenticated} = useAuth(); 
  const [doctor, setDoctor] = useState({});
  const Parametros = useParams()

  const doctorID = Parametros.id
  useEffect(() => {
    if (!doctorID) return;

    const authHeader = getAuthorizationHeader()

    GetDoctorByID(doctorID, authHeader)
      .then((data) => {
        console.log(data, "médico vindo da API");
        setDoctor(data[0])
        ; // supabase retorna array
      })
      .catch((err) => console.error("Erro ao buscar paciente:", err));


  }, [doctorID]);

  //if (!doctor) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  return (
    <>
    <div className="card p-3 shadow-sm">
      <h3 className="mb-3 text-center">MediConnect</h3>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to={'/medicos'}>
          <button className="btn btn-success me-2" >
            <i className="bi bi-chevron-left"></i> Voltar
          </button>
        </Link>
        <div className="d-flex mb-3">
          <div className="avatar avatar-xl">
            <img src={avatarPlaceholder} alt="" />
          </div>
          <div className="media-body ms-3 font-extrabold">
            <span>{doctor.nome || "Nome Completo"}</span>
            <p>{doctor.cpf || "CPF"}</p>
          </div>
        </div>
        <Link to={`/medicos/${doctor.id}/edit`}>
          <button className="btn btn-light" onClick={() => {console.log(doctor.id)}} >
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
          <p>{doctor.full_name || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Data de nascimento:</label>
          <p>{doctor.birth_date || "-"}</p>
        </div>
        
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">CPF:</label>
          <p>{doctor.cpf || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">CRM:</label>
          <p>{doctor.crm || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Estado do CRM:</label>
          <p>{doctor.crm_uf || "-"}</p>
        </div>
        
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Especialização:</label>
          <p>{doctor.specialty || "-"}</p>
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
          <p>{doctor.cep || "-"}</p>
        </div>
        <div className="col-md-8 mb-3">
          <label className="font-extrabold">Rua:</label>
          <p>{doctor.street || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Bairro:</label>
          <p>{doctor.neighborhood || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Cidade:</label>
          <p>{doctor.city || "-"}</p>
        </div>
        <div className="col-md-2 mb-3">
          <label className="font-extrabold">Estado:</label>
          <p>{doctor.state || "-"}</p>
        </div>
        <div className="col-md-4 mb-3">
          <label className="font-extrabold">Número:</label>
          <p>{doctor.number || "-"}</p>
        </div>
        <div className="col-md-8 mb-3">
          <label className="font-extrabold">Complemento:</label>
          <p>{doctor.complement || "-"}</p>
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
          <p>{doctor.email || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Telefone:</label>
          <p>{doctor.phone_mobile || "-"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="font-extrabold">Telefone 2:</label>
          <p>{doctor.phone2 || "-"}</p>
        </div>
        
      </div>
      </div>
    </>
  );
};

export default Details;