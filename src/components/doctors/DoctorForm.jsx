import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./DoctorForm.css";
import HorariosDisponibilidade from "../doctors/HorariosDisponibilidade";

const ENDPOINT_AVAILABILITY =
  "https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_availability";

function DoctorForm({ onSave, onCancel, formData, setFormData, isLoading }) {
  const navigate = useNavigate();
  const location = useLocation();


  const FormatTelefones = (valor) => {
    const digits = String(valor).replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d)/, "($1")
      .replace(/(\d{2})(\d)/, "$1) $2")
      .replace(/(\d)(\d{4})/, "$1 $2")
      .replace(/(\d{4})(\d{4})/, "$1-$2");
  };

  const FormatCPF = (valor) => {
    const digits = String(valor).replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;

    return (
      digito1 === parseInt(cpfLimpo.charAt(9)) &&
      digito2 === parseInt(cpfLimpo.charAt(10))
    );
  };


  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [cpfError, setCpfError] = useState("");

  const nomeRef = useRef(null);
  const cpfRef = useRef(null);
  const emailRef = useRef(null);
  const telefoneRef = useRef(null);
  const crmUfRef = useRef(null);
  const crmRef = useRef(null);

  const [collapsedSections, setCollapsedSections] = useState({
    dadosPessoais: true,
    contato: false,
    endereco: false,
    horarios: false,
  });

  const handleToggleCollapse = (section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (value && emptyFields.includes(name)) {
      setEmptyFields((prev) => prev.filter((field) => field !== name));
    }

    if (name === "cpf" && cpfError) {
      setCpfError("");
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));

      if (name === "foto" && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === "foto" && !files[0]) {
        setAvatarUrl(null);
      }
    } else if (name.includes("cpf")) {
      let cpfFormatado = FormatCPF(value);
      setFormData((prev) => ({ ...prev, [name]: cpfFormatado }));

      const cpfLimpo = cpfFormatado.replace(/\D/g, "");
      if (cpfLimpo.length === 11) {
        if (!validarCPF(cpfFormatado)) {
          setCpfError("CPF inválido");
        } else {
          setCpfError("");
        }
      }
    } else if (name.includes("phone")) {
      let telefoneFormatado = FormatTelefones(value);
      setFormData((prev) => ({ ...prev, [name]: telefoneFormatado }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityUpdate = useCallback(
    (newAvailability) => {
      setFormData((prev) => ({ ...prev, availability: newAvailability }));
    },
    [setFormData]
  );

  const handleCepBlur = async () => {
    const cep = formData.cep?.replace(/\D/g, "");
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        } else {
          setShowRequiredModal(true);
          setEmptyFields(["cep"]);
        }
      } catch (error) {
        setShowRequiredModal(true);
        setEmptyFields(["cep"]);
      }
    }
  };

  const scrollToEmptyField = (fieldName) => {
    let fieldRef = null;

    switch (fieldName) {
      case "full_name":
        fieldRef = nomeRef;
        setCollapsedSections((prev) => ({ ...prev, dadosPessoais: true }));
        break;
      case "cpf":
        fieldRef = cpfRef;
        setCollapsedSections((prev) => ({ ...prev, dadosPessoais: true }));
        break;
      case "email":
        fieldRef = emailRef;
        setCollapsedSections((prev) => ({ ...prev, contato: true }));
        break;
      case "phone_mobile":
        fieldRef = telefoneRef;
        setCollapsedSections((prev) => ({ ...prev, contato: true }));
        break;
      case "crm_uf":
        fieldRef = crmUfRef;
        setCollapsedSections((prev) => ({ ...prev, dadosPessoais: true }));
        break;
      case "crm":
        fieldRef = crmRef;
        setCollapsedSections((prev) => ({ ...prev, dadosPessoais: true }));
        break;
      default:
        return;
    }

    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        fieldRef.current.focus();

        fieldRef.current.style.border = "2px solid #dc3545";
        fieldRef.current.style.boxShadow =
          "0 0 0 0.2rem rgba(220, 53, 69, 0.25)";

        setTimeout(() => {
          if (fieldRef.current) {
            fieldRef.current.style.border = "";
            fieldRef.current.style.boxShadow = "";
          }
        }, 3000);
      }
    }, 300);
  };
  const handleCreateAvailability = async (newAvailability) => {
    try {
      const response = await fetch(ENDPOINT_AVAILABILITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAvailability),
      });
      const data = await response.json();
      console.log("Disponibilidade criada :", data);
      alert("Disponibilidade criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar disponibilidade:", error);
      alert("Erro ao criar disponibilidade.");
    }
  };

  const handlePatchAvailability = async (id, updatedAvailability) => {
    try {
      const response = await fetch(`${ENDPOINT_AVAILABILITY}?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAvailability),
      });

  const data = await response.json();
  console.log("Disponibilidade atualizada:", data);
  alert("Disponibilidade atualizada com sucesso!");
} catch (error) {
  console.error("Erro ao atualizar disponibilidade:", error);
  alert("Erro ao atualizar disponibilidade.");
}
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.full_name) missingFields.push("full_name");
    if (!formData.cpf) missingFields.push("cpf");
    if (!formData.email) missingFields.push("email");
    if (!formData.phone_mobile) missingFields.push("phone_mobile");
    if (!formData.crm_uf) missingFields.push("crm_uf");
    if (!formData.crm) missingFields.push("crm");

    if (missingFields.length > 0) {
      setEmptyFields(missingFields);
      setShowRequiredModal(true);

      setTimeout(() => {
        if (missingFields.length > 0) {
          scrollToEmptyField(missingFields[0]);
        }
      }, 500);
      return;
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      setShowRequiredModal(true);
      setEmptyFields(["cpf"]);
      setCpfError("CPF deve ter 11 dígitos");
      setTimeout(() => scrollToEmptyField("cpf"), 500);
      return;
    }

    if (!validarCPF(formData.cpf)) {
      setShowRequiredModal(true);
      setEmptyFields(["cpf"]);
      setCpfError("CPF inválido");
      setTimeout(() => scrollToEmptyField("cpf"), 500);
      return;
    }

    try {
      await onSave({ ...formData });

      if (formData.availability && formData.availability.length > 0) {
        if (formData.availabilityId) {
          await handlePatchAvailability(
            formData.availabilityId,
            formData.availability
          );
        } else {
          await handleCreateAvailability(formData.availability);
        }
      }

      alert("Médico salvo e disponibilidade enviada ao mock com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar médico ou disponibilidade:", error);
      alert("Erro ao salvar médico ou disponibilidade.");
    };
  };

  const handleModalClose = () => {
    setShowRequiredModal(false);
  };


  return (
    <>
      {/* Modal de Alerta */}
      {showRequiredModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Atenção</h5>
              <button onClick={handleModalClose} className="modal-close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-message">
                {cpfError ? "Problema com o CPF:" : "Por favor, preencha:"}
              </p>
              <div className="modal-list">
                {cpfError ? (
                  <p className="modal-list-item">{cpfError}</p>
                ) : (
                  <>
                    {!formData.full_name && (
                      <p className="modal-list-item">- Nome</p>
                    )}
                    {!formData.cpf && <p className="modal-list-item">- CPF</p>}
                    {!formData.email && (
                      <p className="modal-list-item">- Email</p>
                    )}
                    {!formData.phone_mobile && (
                      <p className="modal-list-item">- Telefone</p>
                    )}
                    {!formData.crm_uf && (
                      <p className="modal-list-item">- Estado do CRM</p>
                    )}
                    {!formData.crm && <p className="modal-list-item">- CRM</p>}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleModalClose} className="modal-confirm-btn">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário Principal */}
      <div className="card doctor-form-container shadow-sm">
        <h3 className="doctor-form-title">MediConnect</h3>

        {/* DADOS PESSOAIS */}
        <div className="form-section">
          <h4
            className="section-header"
            onClick={() => handleToggleCollapse("dadosPessoais")}
          >
            Dados Pessoais
            <span className="section-toggle">
              {collapsedSections.dadosPessoais ? "▲" : "▼"}
            </span>
          </h4>
          <div
            className={`collapse${
              collapsedSections.dadosPessoais ? " show" : ""
            }`}
          >
            <div className="row mt-3">
              {/* Foto / Avatar */}
              <div className="col-md-6 mb-3 avatar-container">
                <div className="me-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar do Médico"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">&#x2624;</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="foto-input"
                    className="btn btn-primary file-input-label"
                  >
                    Carregar Foto
                  </label>
                  <input
                    type="file"
                    className="form-control d-none"
                    name="foto"
                    id="foto-input"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  {formData.foto && (
                    <span className="ms-2 form-label">
                      {formData.foto.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Nome Completo */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome: *</label>
                <input
                  ref={nomeRef}
                  type="text"
                  className="form-control form-control-custom"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Data de Nascimento */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Data de nascimento:</label>
                <input
                  type="date"
                  className="form-control form-control-custom"
                  name="birth_date"
                  value={formData.birth_date || ""}
                  onChange={handleChange}
                  min="1900-01-01"
                  max="2025-09-24"
                />
              </div>
              {/* CPF */}
              <div className="col-md-6 mb-3">
                <label className="form-label">CPF: *</label>
                <input
                  ref={cpfRef}
                  type="text"
                  className={`form-control form-control-custom ${
                    cpfError ? "is-invalid" : ""
                  }`}
                  name="cpf"
                  value={formData.cpf || ""}
                  onChange={handleChange}
                />
                {cpfError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {cpfError}
                  </div>
                )}
              </div>

              {/* Estado do CRM */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Estado do CRM: *</label>
                <select
                  ref={crmUfRef}
                  className="form-control form-control-custom"
                  name="crm_uf"
                  value={formData.crm_uf || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="AP">AP</option>
                  <option value="AL">AL</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>

              {/* CRM */}
              <div className="col-md-6 mb-3">
                <label className="form-label">CRM: *</label>
                <input
                  ref={crmRef}
                  type="text"
                  className="form-control form-control-custom"
                  name="crm"
                  value={formData.crm || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Especialização */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Especialização:</label>
                <select
                  className="form-control form-control-custom"
                  name="specialty"
                  value={formData.specialty || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="Clínica Geral">
                    Clínica médica (clínico geral)
                  </option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ginecologia">Ginecologia e obstetrícia</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Ortopedia">Ortopedia e traumatologia</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Otorrinolaringologia">
                    Otorrinolaringologia
                  </option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Endocrinologia">Endocrinologia</option>
                  <option value="Gastroenterologia">Gastroenterologia</option>
                  <option value="Urologia">Urologia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CONTATO */}
        <div className="form-section">
          <h4
            className="section-header"
            onClick={() => handleToggleCollapse("contato")}
          >
            Contato
            <span className="section-toggle">
              {collapsedSections.contato ? "▲" : "▼"}
            </span>
          </h4>
          <div
            className={`collapse${collapsedSections.contato ? " show" : ""}`}
          >
            <div className="row mt-3">
              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email: *</label>
                <input
                  ref={emailRef}
                  type="email"
                  className="form-control form-control-custom"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Telefone 1 (Principal) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone: *</label>
                <input
                  ref={telefoneRef}
                  type="text"
                  className="form-control form-control-custom"
                  name="phone_mobile"
                  value={formData.phone_mobile || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Telefone 2 (Opcional) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone 2:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="phone2"
                  value={formData.phone2 || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="form-section">
          <h4
            className="section-header"
            onClick={() => handleToggleCollapse("endereco")}
          >
            Endereço
            <span className="section-toggle">
              {collapsedSections.endereco ? "▲" : "▼"}
            </span>
          </h4>
          <div
            className={`collapse${collapsedSections.endereco ? " show" : ""}`}
          >
            <div className="row mt-3">
              {/* CEP */}
              <div className="col-md-4 mb-3">
                <label className="form-label">CEP:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="cep"
                  value={formData.cep || ""}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                />
              </div>
              {/* Rua */}
              <div className="col-md-8 mb-3">
                <label className="form-label">Rua:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="street"
                  value={formData.street || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Bairro */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Bairro:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="neighborhood"
                  value={formData.neighborhood || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Cidade */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Cidade:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Estado */}
              <div className="col-md-2 mb-3">
                <label className="form-label">Estado:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Número */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Número:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="number"
                  value={formData.number || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Complemento */}
              <div className="col-md-8 mb-3">
                <label className="form-label">Complemento:</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  name="complement"
                  value={formData.complement || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* HORÁRIOS */}
        <div className="form-section">
          <h4
            className="section-header"
            onClick={() => handleToggleCollapse("horarios")}
          >
            Horários de Atendimento
            <span className="section-toggle">
              {collapsedSections.horarios ? "▲" : "▼"}
            </span>
          </h4>
          <div
            className={`collapse${collapsedSections.horarios ? " show" : ""}`}
          >
            <div className="row mt-3">
              <div className="col-12 mb-3">
                <p className="form-label text-muted">
                  Defina seus horários de atendimento para cada dia da semana.
                  Marque um dia para começar a adicionar blocos de tempo.
                </p>
                <HorariosDisponibilidade
                  initialAvailability={formData.availability}
                  onUpdate={handleAvailabilityUpdate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="actions-container">
          <button
            className="btn btn-success btn-submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Médico"}
          </button>

          <Link to={`/${location.pathname.split("/")[1]}/medicos`}>
            <button className="btn btn-light btn-cancel">Cancelar</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default DoctorForm;
