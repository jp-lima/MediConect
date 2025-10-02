import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
// formatar número 
// formatar CPF
import { FormatTelefones,FormatPeso, FormatCPF } from '../utils/Formatar/Format';

function PatientForm({ onSave, onCancel, formData, setFormData }) {
  const [errorModalMsg, setErrorModalMsg] = useState("");
  // Estado para controlar a exibição do modal e os dados do paciente existente
  const [showModal, setShowModal] = useState(false);
  const [showModal404, setShowModal404] = useState(false);
  const [pacienteExistente, setPacienteExistente] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);



  // Estado para armazenar a URL da foto do avatar
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Estado para controlar quais seções estão colapsadas
  const [collapsedSections, setCollapsedSections] = useState({
    dadosPessoais: true, // Alterado para true para a seção ficar aberta por padrão
    infoMedicas: false,
    infoConvenio: false,
    endereco: false,
    contato: false,
  });

  // Função para alternar o estado de colapso de uma seção
  const handleToggleCollapse = (section) => {
    setCollapsedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  // Lógica para calcular o IMC
  useEffect(() => {
    const peso = parseFloat(formData.peso);
    const altura = parseFloat(formData.height_m);
    if (peso > 0 && altura > 0) {
      const imcCalculado = peso / (altura * altura);
      setFormData(prev => ({ ...prev, bmi: imcCalculado.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, bmi: '' }));
    }
  }, [formData.peso, formData.altura]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    console.log(formData, name, checked)

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });

      // Lógica para pré-visualizar a imagem no avatar
     if (name === 'foto' && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === 'foto' && !files[0]) {
        setAvatarUrl(null); // Limpa o avatar se nenhum arquivo for selecionado
      }}
      

    else if (name.includes('cpf')) {
      setFormData({...formData, cpf:FormatCPF(value) });
    } else if (name.includes('phone')) {
      setFormData({ ...formData, [name]: FormatTelefones(value) });      
    }else if(name.includes('weight') || name.includes('bmi') || name.includes('height')){
      setFormData({...formData,[name]: FormatPeso(value) })
    }else if(name.includes('rn') || name.includes('vip')){
      setFormData({ ...formData, [name]: checked });
    }
    else{
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
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
          alert('CEP não encontrado!');
        }
      } catch (error) {
        alert('Erro ao buscar o CEP.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.cpf || !formData.sex || !formData.birth_date){
      console.log(formData.full_name, formData.cpf, formData.sex, formData.birth_date)
      setErrorModalMsg('Por favor, preencha Nome, CPF, Gênero e data de nascimento.');
      setShowModal404(true); 
      return
    }
   
    onSave({
      ...formData,bmi:12.0
    });
  
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
            {/* CADASTRO */}
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome: *</label>
              <input type="text" className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome social:</label>
              <input type="text" className="form-control" name="social_name" value={formData.social_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Data de nascimento: *</label>
              <input type="date" className="form-control" name="birth_date" value={formData.birth_date} onChange={handleChange} style={{ fontSize: '1.1rem' }}  />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Gênero: *</label>
              <select className="form-control" name="sex" value={formData.sex} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>CPF: *</label>
              <input type="text" className="form-control" name="cpf" value={formData.cpf} onChange={ handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>RG:</label>
              <input type="text" className="form-control" name="rg" value={formData.rg} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Outros documentos:</label>
              <select className="form-control" name="document_type" value={formData.document_type} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="CNH">CNH</option>
                <option value="Passaporte">Passaporte</option>
                <option value="carteira de trabalho">Carteira de Trabalho</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Número do documento:</label>
              <input type="text" className="form-control" name="document_number" value={formData.document_number} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Etnia e Raça:</label>
              <select className="form-control" name="race" value={formData.race} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
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
              <input type="text" className="form-control" name="naturality" value={formData.naturalidade} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nacionalidade:</label>
              <input type="text" className="form-control" name="nationality" value={formData.nationality} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão:</label>
              <input type="text" className="form-control" name="profession" value={formData.profession} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Estado civil:</label>
              <select className="form-control" name="marital_status" value={formData.marital_status} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="" selected disabled invisible>Selecione</option>
                <option value="Solteiro">Solteiro(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viuvo">Viúvo(a)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome da Mãe:</label>
              <input type="text" className="form-control" name="mother_name" value={formData.mother_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão da mãe:</label>
              <input type="text" className="form-control" name="mother_profession" value={formData.mother_profession} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome do Pai:</label>
              <input type="text" className="form-control" name="father_name" value={formData.father_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Profissão do pai:</label>
              <input type="text" className="form-control" name="father_profession" value={formData.father_profession} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome do responsável:</label>
              <input type="text" className="form-control" name="guardian_name" value={formData.guardian_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>CPF do responsável:</label>
              <input type="text" className="form-control" name="guardian_cpf" value={formData.guardian_cpf} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Identificador de outro sistema:</label>
              <input type="text" className="form-control" name="legacy_code" value={formData.legacy_code} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-12 mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="rn_in_insurance" checked={formData.rn_in_insurance} onChange={handleChange} id="rn_in_insurance" style={{ transform: 'scale(1.2)' }} />
                <label className="form-check-label ms-2" htmlFor="rn_in_insurance" style={{ fontSize: '1.1rem' }}>
                  RN na Guia do convênio
                </label>
              </div>
            </div>

            {/* CAMPOS MOVIDOS */}
            <div className="col-md-12 mb-3 mt-3">
              <label style={{ fontSize: '1.1rem' }}>Observações:</label>
              <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} style={{ fontSize: '1.1rem' }} placeholder='alergias, doenças crônicas, informações sobre porteses ou marca-passo, etc'></textarea>
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
              <select className="form-control" name="blood_type" value={formData.blood_type} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
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
              <input type="text" step="0.1" className="form-control" name="weight_kg" value={formData.weight_kg} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Altura (m):</label>
              <input type="text" step="0.01" className="form-control" name="height_m" value={formData.height_m} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>IMC (kg/m²):</label>
              <input type="text" className="form-control" name="bmi" value={formData.bmi} readOnly disabled style={{ fontSize: '1.1rem' }} />
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
              <select className="form-control" name="convenio" value={formData.convenio} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="Amil">Amil</option>
                <option value="Bradesco Saúde">Bradesco Saúde</option>
                <option value="SulAmérica">SulAmérica</option>
                <option value="Unimed">Unimed</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Plano:</label>
              <input type="text" className="form-control" name="plano" value={formData.plano} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nº de matrícula:</label>
              <input type="text" className="form-control" name="numeroMatricula" value={formData.numeroMatricula} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Validade da Carteira:</label>
              <input type="date" className="form-control" name="validadeCarteira" value={formData.validadeCarteira} onChange={handleChange} disabled={formData.validadeIndeterminada} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 d-flex align-items-end mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="validadeIndeterminada" checked={formData.validadeIndeterminada} onChange={handleChange} id="validadeIndeterminada" style={{ transform: 'scale(1.2)' }} />
                <label className="form-check-label ms-2" htmlFor="validadeIndeterminada" style={{ fontSize: '1.1rem' }}>
                  Validade indeterminada
                </label>
              </div>
            </div>
            {/* PACIENTE VIP */}
            <div className="col-md-12 mb-3 mt-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="vip" checked={formData.vip} onChange={handleChange} id="vip" style={{ transform: 'scale(1.2)' }} />
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
              <input type="text" className="form-control" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-8 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Rua:</label>
              <input type="text" className="form-control" name="street" value={formData.street} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Bairro:</label>
              <input type="text" className="form-control" name="neighborhood" value={formData.neighborhood} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Cidade:</label>
              <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-2 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Estado:</label>
              <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-4 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Número:</label>
              <input type="text" className="form-control" name="number" value={formData.number} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-8 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Complemento:</label>
              <input type="text" className="form-control" name="complement" value={formData.complement} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTATO */}
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
              <label style={{ fontSize: '1.1rem' }}>Email:</label>
              <input type="email" className="form-control" name="email" value={formData.email || ''} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone:</label>
              <input type="text" className="form-control" name="phone_mobile" value={formData.phone_mobile} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone 2:</label>
              <input type="text" className="form-control" name="phone1" value={formData.phone1} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone 3:</label>
              <input type="text" className="form-control" name="phone2" value={formData.phone2} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões */}
      <div className="mt-3 text-center">
        <button className="btn btn-success me-3" onClick={handleSubmit} style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
          Salvar Paciente
        </button>
       
       <Link to='/pacientes'>
          <button className="btn btn-light"  style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
            Cancelar
          </button>
        </Link>
      </div>


      {/* Modal para paciente existente */}
      {showModal && pacienteExistente && (
        <div></div>
      )}

      {/* Modal de sucesso ao salvar paciente */}
      {showSuccessModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#f2fa0dff' }}>
                <h5 className="modal-title">Paciente salvo com sucesso!</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccessModal(false)}></button>
              </div>
              <div className="modal-body">
                <p style={{ color: '#111', fontSize: '1.4rem' }}>O cadastro do paciente foi realizado com sucesso.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" style={{ backgroundColor: '#1e3a8a', color: '#fff' }} onClick={() => setShowSuccessModal(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal404 && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#f2fa0dff' }}>
                <h5 className="modal-title"><span className="text-dark">Atenção</span></h5>
                <button type="button" className="btn-close btn-close-black" onClick={() => setShowModal404(false)}></button>
              </div>
              <div className="modal-body">
                <p style={{ color: '#111', fontSize: '1.4rem' }}>{errorModalMsg || '(Erro 404).Por favor, tente novamente mais tarde'}</p>
              </div>
              <div className="modal-footer">
                
                
                <button type="button" className="btn btn-primary" onClick={() => setShowModal404(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientForm;