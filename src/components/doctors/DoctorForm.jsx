import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function DoctorForm({ onSave, onCancel, formData, setFormData, isLoading }) {
  const navigate = useNavigate();
  const location = useLocation();

  const FormatTelefones = (valor) => {
    const digits = String(valor).replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d)/, '($1')
      .replace(/(\d{2})(\d)/, '$1) $2')
      .replace(/(\d)(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d{4})/, '$1-$2');
  };

  const FormatCPF = (valor) => {
    const digits = String(valor).replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

 
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
 
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
    
  
    return digito1 === parseInt(cpfLimpo.charAt(9)) && digito2 === parseInt(cpfLimpo.charAt(10));
  };

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [cpfError, setCpfError] = useState('');

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
  });

  const handleToggleCollapse = (section) => {
    setCollapsedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

   
    if (value && emptyFields.includes(name)) {
      setEmptyFields(prev => prev.filter(field => field !== name));
    }

   
    if (name === 'cpf' && cpfError) {
      setCpfError('');
    }

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));

      if (name === 'foto' && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === 'foto' && !files[0]) {
        setAvatarUrl(null);
      }

    } else if (name.includes('cpf')) {
      let cpfFormatado = FormatCPF(value);
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));

      
      const cpfLimpo = cpfFormatado.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        if (!validarCPF(cpfFormatado)) {
          setCpfError('CPF inválido');
        } else {
          setCpfError('');
        }
      }
    } else if (name.includes('phone')) {
      let telefoneFormatado = FormatTelefones(value);
      setFormData(prev => ({ ...prev, [name]: telefoneFormatado }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.cep?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        } else {
          setShowRequiredModal(true);
          setEmptyFields(['cep']);
        }
      } catch (error) {
        setShowRequiredModal(true);
        setEmptyFields(['cep']);
      }
    }
  };

 
  const scrollToEmptyField = (fieldName) => {
    let fieldRef = null;
    
    switch (fieldName) {
      case 'full_name':
        fieldRef = nomeRef;
        setCollapsedSections(prev => ({ ...prev, dadosPessoais: true }));
        break;
      case 'cpf':
        fieldRef = cpfRef;
        setCollapsedSections(prev => ({ ...prev, dadosPessoais: true }));
        break;
      case 'email':
        fieldRef = emailRef;
        setCollapsedSections(prev => ({ ...prev, contato: true }));
        break;
      case 'phone_mobile':
        fieldRef = telefoneRef;
        setCollapsedSections(prev => ({ ...prev, contato: true }));
        break;
      case 'crm_uf':
        fieldRef = crmUfRef;
        setCollapsedSections(prev => ({ ...prev, dadosPessoais: true }));
        break;
      case 'crm':
        fieldRef = crmRef;
        setCollapsedSections(prev => ({ ...prev, dadosPessoais: true }));
        break;
      default:
        return;
    }


    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        fieldRef.current.focus();
        
  
        fieldRef.current.style.border = '2px solid #dc3545';
        fieldRef.current.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        
   
        setTimeout(() => {
          if (fieldRef.current) {
            fieldRef.current.style.border = '';
            fieldRef.current.style.boxShadow = '';
          }
        }, 3000);
      }
    }, 300);
  };

  const handleSubmit = async () => {

    const missingFields = [];
    if (!formData.full_name) missingFields.push('full_name');
    if (!formData.cpf) missingFields.push('cpf');
    if (!formData.email) missingFields.push('email');
    if (!formData.phone_mobile) missingFields.push('phone_mobile');
    if (!formData.crm_uf) missingFields.push('crm_uf');
    if (!formData.crm) missingFields.push('crm');

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

   
    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setShowRequiredModal(true);
      setEmptyFields(['cpf']);
      setCpfError('CPF deve ter 11 dígitos');
      setTimeout(() => scrollToEmptyField('cpf'), 500);
      return;
    }

   
    if (!validarCPF(formData.cpf)) {
      setShowRequiredModal(true);
      setEmptyFields(['cpf']);
      setCpfError('CPF inválido');
      setTimeout(() => scrollToEmptyField('cpf'), 500);
      return;
    }

  
    try {
      await onSave({ ...formData });

    } catch (error) {
    
      throw error;
    }
  };

  const handleModalClose = () => {
    setShowRequiredModal(false);
  };

  return (
    <>
 
      {showRequiredModal && (
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
                backgroundColor: "#1e3a8a",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: "#fff", margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>Atenção</h5>
              <button
                onClick={handleModalClose}
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
              <p style={{ color: "#111", fontSize: "1.1rem", margin: "0 0 15px 0", fontWeight: "bold" }}>
                {cpfError ? 'Problema com o CPF:' : 'Por favor, preencha:'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '10px' }}>
                {cpfError ? (
                  <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>{cpfError}</p>
                ) : (
                  <>
                    {!formData.full_name && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- Nome</p>}
                    {!formData.cpf && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- CPF</p>}
                    {!formData.email && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- Email</p>}
                    {!formData.phone_mobile && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- Telefone</p>}
                    {!formData.crm_uf && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- Estado do CRM</p>}
                    {!formData.crm && <p style={{ color: "#111", fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>- CRM</p>}
                  </>
                )}
              </div>
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
                onClick={handleModalClose}
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

      <div className="card p-3 shadow-sm">
        <h3 className="mb-4 text-center" style={{ fontSize: '2.5rem' }}>MediConnect</h3>

        <div className="mb-5 p-4 border rounded shadow-sm">
          <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center"
            onClick={() => handleToggleCollapse('dadosPessoais')}
            style={{ fontSize: '1.8rem' }}>
            Dados Pessoais
            <span className="fs-5">
              {collapsedSections.dadosPessoais ? '▲' : '▼'}
            </span>
          </h4>
          <div className={`collapse${collapsedSections.dadosPessoais ? ' show' : ''}`}>
            <div className="row mt-3">
              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div className="me-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar do Médico"
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.5rem',
                        color: '#9e9e9e'
                      }}
                    >
                      &#x2624;
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="foto-input" className="btn btn-primary" style={{ fontSize: '1rem' }}>Carregar Foto</label>
                  <input
                    type="file"
                    className="form-control d-none"
                    name="foto"
                    id="foto-input"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  {formData.foto && <span className="ms-2" style={{ fontSize: '1rem' }}>{formData.foto.name}</span>}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Nome: *</label>
                <input 
                  ref={nomeRef}
                  type="text" 
                  className="form-control" 
                  name="full_name" 
                  value={formData.full_name || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Data de nascimento:</label>
                <input type="date" className="form-control" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} min="1900-01-01" max="2025-09-24" />
              </div>
              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>CPF: *</label>
                <input 
                  ref={cpfRef}
                  type="text" 
                  className={`form-control ${cpfError ? 'is-invalid' : ''}`}
                  name="cpf" 
                  value={formData.cpf || ''} 
                  onChange={handleChange} 
                />
                {cpfError && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {cpfError}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Estado do CRM: *</label>
                <select 
                  ref={crmUfRef}
                  className="form-control" 
                  name="crm_uf" 
                  value={formData.crm_uf || ''} 
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

              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>CRM: *</label>
                <input 
                  ref={crmRef}
                  type="text" 
                  className="form-control" 
                  name="crm" 
                  value={formData.crm || ''} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Especialização:</label>
                <select className="form-control" name="specialty" value={formData.specialty || ''} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Clínica Geral">Clínica médica (clínico geral)</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ginecologia">Ginecologia e obstetrícia</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Ortopedia">Ortopedia e traumatologia</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Otorrinolaringologia">Otorrinolaringologia</option>
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

        <div className="mb-5 p-4 border rounded shadow-sm">
          <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center"
            onClick={() => handleToggleCollapse('contato')}
            style={{ fontSize: '1.8rem' }}>
            Contato
            <span className="fs-5">
              {collapsedSections.contato ? '▲' : '▼'}
            </span>
          </h4>
          <div className={`collapse${collapsedSections.contato ? ' show' : ''}`}>
            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Email: *</label>
                <input 
                  ref={emailRef}
                  type="email" 
                  className="form-control" 
                  name="email" 
                  value={formData.email || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Telefone: *</label>
                <input 
                  ref={telefoneRef}
                  type="text" 
                  className="form-control" 
                  name="phone_mobile" 
                  value={formData.phone_mobile || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label style={{ fontSize: '1.1rem' }}>Telefone 2:</label>
                <input type="text" className="form-control" name="phone2" value={formData.phone2 || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 p-4 border rounded shadow-sm">
          <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center"
            onClick={() => handleToggleCollapse('endereco')}
            style={{ fontSize: '1.8rem' }}>
            Endereço
            <span className="fs-5">
              {collapsedSections.endereco ? '▲' : '▼'}
            </span>
          </h4>
          <div className={`collapse${collapsedSections.endereco ? ' show' : ''}`}>
            <div className="row mt-3">
              <div className="col-md-4 mb-3">
                <label>CEP:</label>
                <input type="text" className="form-control" name="cep" value={formData.cep || ''} onChange={handleChange} onBlur={handleCepBlur} />
              </div>
              <div className="col-md-8 mb-3">
                <label>Rua:</label>
                <input type="text" className="form-control" name="street" value={formData.street || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label>Bairro:</label>
                <input type="text" className="form-control" name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Cidade:</label>
                <input type="text" className="form-control" name="city" value={formData.city || ''} onChange={handleChange} />
              </div>
              <div className="col-md-2 mb-3">
                <label>Estado:</label>
                <input type="text" className="form-control" name="state" value={formData.state || ''} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Número:</label>
                <input type="text" className="form-control" name="number" value={formData.number || ''} onChange={handleChange} />
              </div>
              <div className="col-md-8 mb-3">
                <label>Complemento:</label>
                <input type="text" className="form-control" name="complement" value={formData.complement || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <button
            className="btn btn-success me-3"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Médico'}
          </button>
          
          <Link to={`/${location.pathname.split("/")[1]}/medicos`}>
            <button 
              className="btn btn-light" 
              style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}
            >
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default DoctorForm;