import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FormatTelefones, FormatPeso, FormatCPF } from '../utils/Formatar/Format';

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

   
    await onSave({ ...formData, bmi: parseFloat(formData.bmi) || null });
  };

  const handleModalClose = () => {
    setShowRequiredModal(false);
  };

  return (
    <div className="card p-3">
      <h3 className="mb-4 text-center" style={{ fontSize: '2.5rem' }}>MediConnect</h3>

      {/* DADOS PESSOAIS */}
      <div className="mb-5 p-4 border rounded shadow-sm">
        <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center" onClick={() => handleToggleCollapse('dadosPessoais')} style={{ fontSize: '1.8rem' }}>
          Dados Pessoais
          <span className="fs-5">
            {collapsedSections.dadosPessoais ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.dadosPessoais ? ' show' : ''}`}>
          <div className="row mt-3">
            {/* AVATAR E INPUT DE FOTO */}
            <div className="col-md-6 mb-3 d-flex align-items-center">
              <div className="me-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar do Paciente"
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

            {/* CAMPOS OBRIGATÓRIOS */}
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome: *</label>
              <input
                ref={nomeRef}
                type="text"
                className="form-control"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                style={{ fontSize: '1.1rem' }}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome social:</label>
              <input type="text" className="form-control" name="social_name" value={formData.social_name || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Data de nascimento:</label>
              <input
                type="date"
                className="form-control"
                name="birth_date"
                value={formData.birth_date || ''}
                onChange={handleChange}
                style={{ fontSize: '1.1rem' }}
                min="1900-01-01" max="2025-09-24"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Gênero:</label>
              <select
                className="form-control"
                name="sex"
                value={formData.sex || ''}
                onChange={handleChange}
                style={{ fontSize: '1.1rem' }}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
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
                style={{ fontSize: '1.1rem' }}
                required
              />
              {cpfError && (
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  {cpfError}
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>RG:</label>
              <input type="text" className="form-control" name="rg" value={formData.rg || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Outros documentos:</label>
              <select className="form-control" name="document_type" value={formData.document_type || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="CNH">CNH</option>
                <option value="Passaporte">Passaporte</option>
                <option value="carteira de trabalho">Carteira de Trabalho</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Número do documento:</label>
              <input type="text" className="form-control" name="document_number" value={formData.document_number || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Etnia e Raça:</label>
              <select className="form-control" name="race" value={formData.race || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="Branca">Branca</option>
                <option value="Preta">Preta</option>
                <option value="Parda">Parda</option>
                <option value="Amarela">Amarela</option>
                <option value="Indígena">Indígena</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Naturalidade:</label>
              <input type="text" className="form-control" name="naturality" value={formData.naturalidade || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nacionalidade:</label>
              <input type="text" className="form-control" name="nationality" value={formData.nationality || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão:</label>
              <input type="text" className="form-control" name="profession" value={formData.profession || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Estado civil:</label>
              <select className="form-control" name="marital_status" value={formData.marital_status || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="" disabled>Selecione</option>
                <option value="Solteiro">Solteiro(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viuvo">Viúvo(a)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome da Mãe:</label>
              <input type="text" className="form-control" name="mother_name" value={formData.mother_name || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão da mãe:</label>
              <input type="text" className="form-control" name="mother_profession" value={formData.mother_profession || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome do Pai:</label>
              <input type="text" className="form-control" name="father_name" value={formData.father_name || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão do pai:</label>
              <input type="text" className="form-control" name="father_profession" value={formData.father_profession || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome do responsável:</label>
              <input type="text" className="form-control" name="guardian_name" value={formData.guardian_name || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>CPF do responsável:</label>
              <input type="text" className="form-control" name="guardian_cpf" value={formData.guardian_cpf || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Identificador de outro sistema:</label>
              <input type="text" className="form-control" name="legacy_code" value={formData.legacy_code || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-12 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="rn_in_insurance" checked={formData.rn_in_insurance || false} onChange={handleChange} id="rn_in_insurance" style={{ transform: 'scale(1.2)' }} />
                <label className="form-check-label ms-2" htmlFor="rn_in_insurance" style={{ fontSize: '1.1rem' }}>
                  RN na Guia do convênio
                </label>
              </div>
            </div>

            {/* CAMPOS ADICIONAIS */}
            <div className="col-md-12 mb-3 mt-3">
              <label style={{ fontSize: '1.1rem' }}>Observações:</label>
              <textarea className="form-control" name="notes" value={formData.notes || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} placeholder='alergias, doenças crônicas, informações sobre porteses ou marca-passo, etc'></textarea>
            </div>
            <div className="col-md-12 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Anexos do Paciente:</label>
              <div>
                <label htmlFor="anexos-input" className="btn btn-secondary" style={{ fontSize: '1.1rem' }}>Escolher arquivo</label>
                <input type="file" className="form-control d-none" name="anexos" id="anexos-input" onChange={handleChange} />
                <span className="ms-2" style={{ fontSize: '1.1rem' }}>{formData.anexos ? formData.anexos.name : 'Nenhum arquivo escolhido'}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* INFORMAÇÕES MÉDICAS */}
      <div className="mb-5 p-4 border rounded shadow-sm">
        <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center" onClick={() => handleToggleCollapse('infoMedicas')} style={{ fontSize: '1.8rem' }}>
          Informações Médicas
          <span className="fs-5">
            {collapsedSections.infoMedicas ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.infoMedicas ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Tipo Sanguíneo:</label>
              <select className="form-control" name="blood_type" value={formData.blood_type || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
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
              <label style={{ fontSize: '1.1rem' }}>Peso (kg):</label>
              <input type="text" step="0.1" className="form-control" name="weight_kg" value={formData.weight_kg || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Altura (m):</label>
              <input type="text" step="0.01" className="form-control" name="height_m" value={formData.height_m || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>IMC (kg/m²):</label>
              <input type="text" className="form-control" name="bmi" value={formData.bmi || ''} readOnly disabled style={{ fontSize: '1.1rem' }} />
            </div>

          </div>
        </div>
      </div>

      {/* INFORMAÇÕES DE CONVÊNIO */}
      <div className="mb-5 p-4 border rounded shadow-sm">
        <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center" onClick={() => handleToggleCollapse('infoConvenio')} style={{ fontSize: '1.8rem' }}>
          Informações de convênio
          <span className="fs-5">
            {collapsedSections.infoConvenio ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.infoConvenio ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Convênio:</label>
              <select className="form-control" name="convenio" value={formData.convenio || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="Amil">Amil</option>
                <option value="Bradesco Saúde">Bradesco Saúde</option>
                <option value="SulAmérica">SulAmérica</option>
                <option value="Unimed">Unimed</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Plano:</label>
              <input type="text" className="form-control" name="plano" value={formData.plano || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nº de matrícula:</label>
              <input type="text" className="form-control" name="numeroMatricula" value={formData.numeroMatricula || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Validade da Carteira:</label>
              <input type="date" className="form-control" name="validadeCarteira" value={formData.validadeCarteira || ''} onChange={handleChange} disabled={formData.validadeIndeterminada} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 d-flex align-items-end mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="validadeIndeterminada" checked={formData.validadeIndeterminada || false} onChange={handleChange} id="validadeIndeterminada" style={{ transform: 'scale(1.2)' }} />
                <label className="form-check-label ms-2" htmlFor="validadeIndeterminada" style={{ fontSize: '1.1rem' }}>
                  Validade indeterminada
                </label>
              </div>
            </div>
            {/* PACIENTE VIP */}
            <div className="col-md-12 mb-3 mt-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="vip" checked={formData.vip || false} onChange={handleChange} id="vip" style={{ transform: 'scale(1.2)' }} />
                <label className="form-check-label ms-2" htmlFor="vip" style={{ fontSize: '1.1rem' }}>
                  Paciente VIP
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENDEREÇO */}
      <div className="mb-5 p-4 border rounded shadow-sm">
        <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center" onClick={() => handleToggleCollapse('endereco')} style={{ fontSize: '1.8rem' }}>
          Endereço
          <span className="fs-5">
            {collapsedSections.endereco ? '▲' : '▼'}
          </span>
        </h4>
        <div className={`collapse${collapsedSections.endereco ? ' show' : ''}`}>
          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>CEP:</label>
              <input type="text" className="form-control" name="cep" value={formData.cep || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-8 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Rua:</label>
              <input type="text" className="form-control" name="street" value={formData.street || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Bairro:</label>
              <input type="text" className="form-control" name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Cidade:</label>
              <input type="text" className="form-control" name="city" value={formData.city || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Estado:</label>
              <input type="text" className="form-control" name="state" value={formData.state || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Número:</label>
              <input type="text" className="form-control" name="number" value={formData.number || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-8 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Complemento:</label>
              <input type="text" className="form-control" name="complement" value={formData.complement || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 p-4 border rounded shadow-sm">
        <h4 className="mb-4 cursor-pointer d-flex justify-content-between align-items-center" onClick={() => handleToggleCollapse('contato')} style={{ fontSize: '1.8rem' }}>
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
                style={{ fontSize: '1.1rem' }}
                required
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
                style={{ fontSize: '1.1rem' }}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone 2:</label>
              <input type="text" className="form-control" name="phone1" value={formData.phone1 || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone 3:</label>
              <input type="text" className="form-control" name="phone2" value={formData.phone2 || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
          </div>
        </div>
      </div>

  
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


      <div className="mt-3 text-center">
        <button className="btn btn-success me-3" onClick={handleSubmit} disabled={isLoading} style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
          {isLoading ? 'Salvando...' : 'Salvar Paciente'}
        </button>
        <Link to='/secretaria/pacientes'>
          <button className="btn btn-light" style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
            Cancelar
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PatientForm;