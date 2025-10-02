import React, { useState } from 'react';
import {Link} from 'react-router-dom'

function DoctorForm({ onSave, onCancel, formData, setFormData }) {

  const FormatTelefones = (valor) => {

   const digits = String(valor).replace(/\D/g, '').slice(0, 11);

  
  return digits
    .replace(/(\d)/, '($1')   // 123 -> 123.
    .replace(/(\d{2})(\d)/, '$1) $2' )
    .replace(/(\d)(\d{4})/, '$1 $2')
    .replace(/(\d{4})(\d{4})/, '$1-$2')
  }


  const FormatCPF = (valor) => {
  
  const digits = String(valor).replace(/\D/g, '').slice(0, 11);


  
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')   // 123 -> 123.
    .replace(/(\d{3})(\d)/, '$1.$2')   // 123.456 -> 123.456.
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // 123.456.789 -> 123.456.789-01
    
  }


  
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    console.log(name, value)

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
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
      }

    } 

    if (name.includes('cpf')) {
      let cpfFormatado = FormatCPF(value);
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
    } else if (name.includes('telefone')) {
      let telefoneFormatado = FormatTelefones(value);
      setFormData(prev => ({ ...prev, [name]: telefoneFormatado }));
    }else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Função para buscar endereço pelo CEP
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

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
          setModalMsg('CEP não encontrado!');
          setShowModal(true);
        }
      } catch (error) {
        setModalMsg('Erro ao buscar o CEP.');
        setShowModal(true);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.full_name || !formData.cpf || !formData.birth_date ) {
      setModalMsg('Por favor, preencha: Nome, CPF, Data de Nascimento.');
      setShowModal(true);
     
      
    }

    onSave(
      {
      ...formData
      }
      
    );
    setModalMsg('Médico salvo com sucesso!');
    setShowModal(true);
  };

  return (
    <>
      {/* Modal de feedback */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', alignItems: 'flex-start', justifyContent: 'center' }} tabIndex="-1">
          <div className="modal-dialog" style={{ marginTop: '32px' }}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#  ' }}>
                <h5 className="modal-title text-black">Atenção</h5>
                <button type="button" className="btn-close" style={{ filter: 'invert(0)' }} onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-black">
                <p style={{ fontSize: '1.3rem', fontWeight: 500 }}>{modalMsg}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="card p-3 shadow-sm">
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
            {/* CADASTRO */}
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Nome: *</label>
              <input type="text" className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Data de nascimento: *</label>
              <input type="date" className="form-control" name="birth_date" value={formData.birth_date} onChange={handleChange} style={{ fontSize: '1.1rem' }}  min="1900-01-01" max="2025-09-24" />
            </div>
              <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>CPF: *</label>
              <input type="text" className="form-control" name="cpf" value={formData.cpf} onChange={ handleChange} style={{ fontSize: '1.1rem' }} />
            </div>        

             <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Estado do CRM:</label>
              <select className="form-control" name="crm_uf" value={formData.crm_uf} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="" disabled selected>Selecione</option>
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
              <label style={{ fontSize: '1.1rem' }}>CRM:</label>
              <input type="text" className="form-control" name="crm" value={formData.crm} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
              
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Especialização:</label>
              <select className="form-control" name="specialty" value={formData.specialty} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
                <option value="">Selecione</option>
                <option value="Cardiologia">Clínica médica (clínico geral)</option>
                <option value="Dermatologia">Pediatria</option>
                <option value="Ginecologia">Ginecologia e obstetrícia</option>
                <option value="Pediatria">Cardiologia</option>
                <option value="Ortopedia">Ortopedia e traumatologia</option>
                <option value="Oftalmologia">Oftalmologia</option>
                <option value="Neurologia">Otorrinolaringologia</option>
                <option value="Psiquiatria">Dermatologia</option>
                <option value="Endocrinologia">Neurologia</option>
                <option value="Oncologia">Psiquiatria</option>
                <option value="Oncologia">Endocrinologia</option>
                <option value="Oncologia">Gastroenterologia</option>
                <option value="Oncologia">Urologia</option>    
              </select>
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
              <label style={{ fontSize: '1.1rem' }}>Email: </label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone: </label>
              <input type="text" className="form-control" name="phone_mobile" value={formData.phone_mobile} onChange={handleChange} style={{ fontSize: '1.1rem' }} />
            </div>
            <div className="col-md-6 mb-3">
              <label style={{ fontSize: '1.1rem' }}>Telefone 2:</label>
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
        <Link to={'/medicos'}>
          <button className="btn btn-light" onClick={onCancel} style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
            Cancelar
          </button>
        </Link>
      </div>

    </div>
    </>
  );
}

export default DoctorForm;
