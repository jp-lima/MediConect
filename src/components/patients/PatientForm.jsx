import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FormatTelefones, FormatPeso, FormatCPF } from '../utils/Formatar/Format';
import './PatientForm.css';

function PatientForm({ onSave, onCancel, formData, setFormData, isLoading }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [cpfError, setCpfError] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    dadosPessoais: true,
    infoMedicas: false,
    infoConvenio: false,
    endereco: false,
    contato: false,
  });

  const nomeRef = useRef(null);
  const cpfRef = useRef(null);
  const emailRef = useRef(null);
  const telefoneRef = useRef(null);

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

  const handleToggleCollapse = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const peso = parseFloat(formData.weight_kg);
    const altura = parseFloat(formData.height_m);
    if (peso > 0 && altura > 0) {
      const imcCalculado = peso / (altura * altura);
      setFormData(prev => ({ ...prev, bmi: imcCalculado.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, bmi: '' }));
    }
  }, [formData.weight_kg, formData.height_m, setFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (value && emptyFields.includes(name)) {
      setEmptyFields(prev => prev.filter(field => field !== name));
    }

    if (name === 'cpf' && cpfError) {
      setCpfError('');
    }

    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));

      if (name === 'foto' && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarUrl(reader.result);
        reader.readAsDataURL(files[0]);
      } else if (name === 'foto' && !files[0]) {
        setAvatarUrl(null);
      }
    } else if (name === 'cpf') {
      const cpfFormatado = FormatCPF(value);
      setFormData(prev => ({ ...prev, cpf: cpfFormatado }));

      const cpfLimpo = cpfFormatado.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        if (!validarCPF(cpfFormatado)) {
          setCpfError('CPF inválido');
        } else {
          setCpfError('');
        }
      }
    } else if (name.includes('phone')) {
      setFormData(prev => ({ ...prev, [name]: FormatTelefones(value) }));
    } else if (name.includes('weight_kg') || name.includes('height_m')) {
      setFormData(prev => ({ ...prev, [name]: FormatPeso(value) }));
    } else if (name === 'rn_in_insurance' || name === 'vip' || name === 'validadeIndeterminada') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Email inválido. Por favor, verifique o email digitado.');
    }

    await onSave({ ...formData, bmi: parseFloat(formData.bmi) || null });
  };

  const handleModalClose = () => {
    setShowRequiredModal(false);
  };

  return (
    <div className="card patient-form-container">
      <h3 className="patient-form-title">MediConnect</h3>

      {/* DADOS PESSOAIS */}
      <div className="form-section">
        <h4 className="section-header" onClick={() => handleToggleCollapse('dadosPessoais')}>
          Dados Pessoais
          <span className="section-toggle">
            {collapsedSections.dadosPessoais ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.dadosPessoais ? ' show' : ''}`}>
          <div className="row mt-3">
            {/* AVATAR E INPUT DE FOTO */}
            <div className="col-md-6 mb-3 avatar-container">
              <div className="me-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar do Paciente"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    &#x2624;
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="foto-input" className="btn btn-primary file-input-label">Carregar Foto</label>
                <input
                  type="file"
                  className="form-control d-none"
                  name="foto"
                  id="foto-input"
                  onChange={handleChange}
                  accept="image/*"
                />
                {formData.foto && <span className="ms-2 form-label">{formData.foto.name}</span>}
              </div>
            </div>

            {/* CAMPOS OBRIGATÓRIOS */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome: *</label>
              <input
                ref={nomeRef}
                type="text"
                className="form-control form-control-custom"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome social:</label>
              <input type="text" className="form-control form-control-custom" name="social_name" value={formData.social_name || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Data de nascimento:</label>
              <input
                type="date"
                className="form-control form-control-custom"
                name="birth_date"
                value={formData.birth_date || ''}
                onChange={handleChange}
                min="1900-01-01" max="2025-09-24"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Gênero:</label>
              <select
                className="form-control form-control-custom"
                name="sex"
                value={formData.sex || ''}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">CPF: *</label>
              <input
                ref={cpfRef}
                type="text"
                className={`form-control form-control-custom ${cpfError ? 'is-invalid' : ''}`}
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
                required
              />
              {cpfError && (
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  {cpfError}
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">RG:</label>
              <input type="text" className="form-control form-control-custom" name="rg" value={formData.rg || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Outros documentos:</label>
              <select className="form-control form-control-custom" name="document_type" value={formData.document_type || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="CNH">CNH</option>
                <option value="Passaporte">Passaporte</option>
                <option value="carteira de trabalho">Carteira de Trabalho</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Número do documento:</label>
              <input type="text" className="form-control form-control-custom" name="document_number" value={formData.document_number || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Etnia e Raça:</label>
              <select className="form-control form-control-custom" name="race" value={formData.race || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="Branca">Branca</option>
                <option value="Preta">Preta</option>
                <option value="Parda">Parda</option>
                <option value="Amarela">Amarela</option>
                <option value="Indígena">Indígena</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Naturalidade:</label>
              <input type="text" className="form-control form-control-custom" name="naturality" value={formData.naturalidade || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nacionalidade:</label>
              <input type="text" className="form-control form-control-custom" name="nationality" value={formData.nationality || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Profissão:</label>
              <input type="text" className="form-control form-control-custom" name="profession" value={formData.profession || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Estado civil:</label>
              <select className="form-control form-control-custom" name="marital_status" value={formData.marital_status || ''} onChange={handleChange}>
                <option value="" disabled>Selecione</option>
                <option value="Solteiro">Solteiro(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viuvo">Viúvo(a)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome da Mãe:</label>
              <input type="text" className="form-control form-control-custom" name="mother_name" value={formData.mother_name || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Profissão da mãe:</label>
              <input type="text" className="form-control form-control-custom" name="mother_profession" value={formData.mother_profession || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome do Pai:</label>
              <input type="text" className="form-control form-control-custom" name="father_name" value={formData.father_name || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Profissão do pai:</label>
              <input type="text" className="form-control form-control-custom" name="father_profession" value={formData.father_profession || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome do responsável:</label>
              <input type="text" className="form-control form-control-custom" name="guardian_name" value={formData.guardian_name || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">CPF do responsável:</label>
              <input type="text" className="form-control form-control-custom" name="guardian_cpf" value={formData.guardian_cpf || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Identificador de outro sistema:</label>
              <input type="text" className="form-control form-control-custom" name="legacy_code" value={formData.legacy_code || ''} onChange={handleChange} />
            </div>
            <div className="col-md-12 mb-3">
              <div className="form-check">
                <input className="form-check-input checkbox-custom" type="checkbox" name="rn_in_insurance" checked={formData.rn_in_insurance || false} onChange={handleChange} id="rn_in_insurance" />
                <label className="form-check-label checkbox-label" htmlFor="rn_in_insurance">
                  RN na Guia do convênio
                </label>
              </div>
            </div>

            {/* CAMPOS ADICIONAIS */}
            <div className="col-md-12 mb-3 mt-3">
              <label className="form-label">Observações:</label>
              <textarea className="form-control textarea-custom" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder='alergias, doenças crônicas, informações sobre porteses ou marca-passo, etc'></textarea>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Anexos do Paciente:</label>
              <div>
                <label htmlFor="anexos-input" className="btn btn-secondary file-input-label">Escolher arquivo</label>
                <input type="file" className="form-control d-none" name="anexos" id="anexos-input" onChange={handleChange} />
                <span className="ms-2 form-label">{formData.anexos ? formData.anexos.name : 'Nenhum arquivo escolhido'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMAÇÕES MÉDICAS */}
      <div className="form-section">
        <h4 className="section-header" onClick={() => handleToggleCollapse('infoMedicas')}>
          Informações Médicas
          <span className="section-toggle">
            {collapsedSections.infoMedicas ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.infoMedicas ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo Sanguíneo:</label>
              <select className="form-control form-control-custom" name="blood_type" value={formData.blood_type || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Peso (kg):</label>
              <input type="text" step="0.1" className="form-control form-control-custom" name="weight_kg" value={formData.weight_kg || ''} onChange={handleChange} />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Altura (m):</label>
              <input type="text" step="0.01" className="form-control form-control-custom" name="height_m" value={formData.height_m || ''} onChange={handleChange} />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">IMC (kg/m²):</label>
              <input type="text" className="form-control form-control-custom" name="bmi" value={formData.bmi || ''} readOnly disabled />
            </div>
          </div>
        </div>
      </div>

      {/* INFORMAÇÕES DE CONVÊNIO */}
      <div className="form-section">
        <h4 className="section-header" onClick={() => handleToggleCollapse('infoConvenio')}>
          Informações de convênio
          <span className="section-toggle">
            {collapsedSections.infoConvenio ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.infoConvenio ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Convênio:</label>
              <select className="form-control form-control-custom" name="convenio" value={formData.convenio || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="Amil">Amil</option>
                <option value="Bradesco Saúde">Bradesco Saúde</option>
                <option value="SulAmérica">SulAmérica</option>
                <option value="Unimed">Unimed</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Plano:</label>
              <input type="text" className="form-control form-control-custom" name="plano" value={formData.plano || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nº de matrícula:</label>
              <input type="text" className="form-control form-control-custom" name="numeroMatricula" value={formData.numeroMatricula || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Validade da Carteira:</label>
              <input type="date" className="form-control form-control-custom" name="validadeCarteira" value={formData.validadeCarteira || ''} onChange={handleChange} disabled={formData.validadeIndeterminada} />
            </div>
            <div className="col-md-2 d-flex align-items-end mb-3">
              <div className="form-check">
                <input className="form-check-input checkbox-custom" type="checkbox" name="validadeIndeterminada" checked={formData.validadeIndeterminada || false} onChange={handleChange} id="validadeIndeterminada" />
                <label className="form-check-label checkbox-label" htmlFor="validadeIndeterminada">
                  Validade indeterminada
                </label>
              </div>
            </div>
            {/* PACIENTE VIP */}
            <div className="col-md-12 mb-3 mt-3">
              <div className="form-check">
                <input className="form-check-input checkbox-custom" type="checkbox" name="vip" checked={formData.vip || false} onChange={handleChange} id="vip" />
                <label className="form-check-label checkbox-label" htmlFor="vip">
                  Paciente VIP
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENDEREÇO */}
      <div className="form-section">
        <h4 className="section-header" onClick={() => handleToggleCollapse('endereco')}>
          Endereço
          <span className="section-toggle">
            {collapsedSections.endereco ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.endereco ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <label className="form-label">CEP:</label>
              <input type="text" className="form-control form-control-custom" name="cep" value={formData.cep || ''} onChange={handleChange} />
            </div>
            <div className="col-md-8 mb-3">
              <label className="form-label">Rua:</label>
              <input type="text" className="form-control form-control-custom" name="street" value={formData.street || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Bairro:</label>
              <input type="text" className="form-control form-control-custom" name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Cidade:</label>
              <input type="text" className="form-control form-control-custom" name="city" value={formData.city || ''} onChange={handleChange} />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Estado:</label>
              <input type="text" className="form-control form-control-custom" name="state" value={formData.state || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Número:</label>
              <input type="text" className="form-control form-control-custom" name="number" value={formData.number || ''} onChange={handleChange} />
            </div>
            <div className="col-md-8 mb-3">
              <label className="form-label">Complemento:</label>
              <input type="text" className="form-control form-control-custom" name="complement" value={formData.complement || ''} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTATO */}
      <div className="form-section">
        <h4 className="section-header" onClick={() => handleToggleCollapse('contato')}>
          Contato
          <span className="section-toggle">
            {collapsedSections.contato ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.contato ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Email: *</label>
              <input
                ref={emailRef}
                type="email"
                className="form-control form-control-custom"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Telefone: *</label>
              <input
                ref={telefoneRef}
                type="text"
                className="form-control form-control-custom"
                name="phone_mobile"
                value={formData.phone_mobile || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Telefone 2:</label>
              <input type="text" className="form-control form-control-custom" name="phone1" value={formData.phone1 || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Telefone 3:</label>
              <input type="text" className="form-control form-control-custom" name="phone2" value={formData.phone2 || ''} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE VALIDAÇÃO */}
      {showRequiredModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Atenção</h5>
              <button
                onClick={handleModalClose}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-message">
                {cpfError ? 'Problema com o CPF:' : 'Por favor, preencha:'}
              </p>
              <div className="modal-list">
                {cpfError ? (
                  <p className="modal-list-item">{cpfError}</p>
                ) : (
                  <>
                    {!formData.full_name && <p className="modal-list-item">- Nome</p>}
                    {!formData.cpf && <p className="modal-list-item">- CPF</p>}
                    {!formData.email && <p className="modal-list-item">- Email</p>}
                    {!formData.phone_mobile && <p className="modal-list-item">- Telefone</p>}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleModalClose}
                className="modal-confirm-btn"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTÕES DE AÇÃO */}
      <div className="actions-container">
        <button className="btn btn-success btn-submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Paciente'}
        </button>
        <Link to='/secretaria/pacientes'>
          <button className="btn btn-light btn-cancel">
            Cancelar
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PatientForm;