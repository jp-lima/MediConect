import InputMask from "react-input-mask";

import { useState, useEffect } from "react";
import { GetPatientByCPF } from "../components/utils/Functions-Endpoints/Patient";
import { GetDoctorByName, GetAllDoctors } from "../components/utils/Functions-Endpoints/Doctor";
import { useAuth } from "../components/utils/AuthProvider";
import API_KEY from "../components/utils/apiKeys";
import { useNavigate } from "react-router-dom";
const FormConsultaPaciente = ({ onCancel, onSave, setAgendamento, agendamento }) => {
  const {getAuthorizationHeader} = useAuth()

  console.log(agendamento?.dataAtendimento, 'aqui2')

  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const [loadingAnexos, setLoadingAnexos] = useState(false);
  const [acessibilidade, setAcessibilidade] = useState({cadeirante:false,idoso:false,gravida:false,bebe:false, autista:false })


const [todosProfissionais, setTodosProfissionais] = useState([])
const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
const [isDropdownOpen, setIsDropdownOpen] = useState(false); 


  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioTermino, setHorarioTermino] = useState('');

  const [horariosDisponiveis, sethorariosDisponiveis] = useState([])

  let authHeader = getAuthorizationHeader()
 
  const FormatCPF = (valor) => {
    const digits = String(valor).replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

     

  const handleChange = (e) => {
    const {value, name} = e.target;
    console.log(value, name, agendamento)
    
    if(name === 'email'){
      setAgendamento({...agendamento, contato:{
        ...agendamento.contato,
        email:value
      }})}
      else if(name === 'status'){
        if(agendamento.status==='requested'){
        setAgendamento((prev) => ({
                      ...prev,
                      status:'confirmed',
                                          }));  
        }else if(agendamento.status === 'confirmed'){
        console.log(value)
        setAgendamento((prev) => ({
                      ...prev,
                      status:'requested',
                                          }));
      }}
    
    else if(name === 'paciente_cpf'){

      let cpfFormatted = FormatCPF(value)
       const fetchPatient = async () => {
                  let patientData = await GetPatientByCPF(cpfFormatted, authHeader);
                  if (patientData) {
                    setAgendamento((prev) => ({
                      ...prev,
                      paciente_nome: patientData.full_name,
                      patient_id: patientData.id
                    }));
                  }}
      setAgendamento(prev => ({ ...prev, cpf: cpfFormatted }))
      fetchPatient()
    }else if(name==='convenio'){
      setAgendamento({...agendamento,insurance_provider:value})
    }
    else{
    setAgendamento({...agendamento,[name]:value})
    }
  }

  


useEffect(() => {
  const ChamarMedicos = async () => {
    const Medicos = await GetAllDoctors(authHeader)
    setTodosProfissionais(Medicos)
  }
  ChamarMedicos();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("apikey", API_KEY)
  myHeaders.append("Authorization", `Bearer ${authHeader.split(' ')[1]}`);

var raw = JSON.stringify({
   "doctor_id": agendamento.doctor_id,
   "start_date": agendamento.dataAtendimento,
   "end_date": `${agendamento.dataAtendimento}T23:59:59.999Z`,
  
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/get-available-slots", requestOptions)
   .then(response => response.json())
   .then(result => {console.log(result); sethorariosDisponiveis(result)})
   .catch(error => console.log('error', error));

}, [agendamento.dataAtendimento, agendamento.doctor_id])


// FUNÇÃO DE BUSCA E FILTRAGEM
const handleSearchProfissional = (e) => {
    const term = e.target.value;    
    handleChange(e); 
    // 2. Lógica de filtragem:
    if (term.trim() === '') {
        setProfissionaisFiltrados([]);
        setIsDropdownOpen(false);
        return;
    }
    // Adapte o nome da propriedade (ex: 'nome', 'full_name')
    const filtered = todosProfissionais.filter(p => 
        p.full_name.toLowerCase().includes(term.toLowerCase())
    );
    
    setProfissionaisFiltrados(filtered);
    setIsDropdownOpen(filtered.length > 0); // Abre se houver resultados
};


// FUNÇÃO PARA SELECIONAR UM ITEM DO DROPDOWN
const handleSelectProfissional = async (profissional) => {
    setAgendamento(prev => ({
        ...prev,
        doctor_id: profissional.id,
        medico_nome: profissional.full_name
    }));
        // 2. Fecha o dropdown
    setProfissionaisFiltrados([]);
    setIsDropdownOpen(false);
    };

  
const formatarHora = (datetimeString) => {
    return datetimeString.substring(11, 16);
  };

  const opcoesDeHorario = horariosDisponiveis?.slots?.map(item => ({
    
    value: formatarHora(item.datetime),
    label: formatarHora(item.datetime),
    disabled: !item.available
  }));

const handleSubmit = (e) => {
    e.preventDefault();
    alert("Agendamento salvo!");
    navigate("/paciente/agendamento")
    onSave({...agendamento, horarioInicio:horarioInicio})
  };

  return (
    <div className="form-container">
      

      <form className="form-agendamento" onSubmit={handleSubmit}>
        1
      
        <h2 className="section-title">Informações do atendimento</h2>
       

        <div className="campo-informacoes-atendimento">
            
            <div className="campo-de-input-container"> {/* NOVO CONTAINER PAI */}
    <div className="campo-de-input">
        <label>Nome do profissional *</label>
        <input 
            type="text" 
            name="medico_nome" // Use o nome correto da propriedade no estado `agendamento`
            onChange={handleSearchProfissional} 
            value={agendamento.medico_nome} 
            autoComplete="off" // Ajuda a evitar o autocomplete nativo do navegador
            required 
        />
    </div>

    {/* DROPDOWN - RENDERIZAÇÃO CONDICIONAL */}
    {isDropdownOpen && profissionaisFiltrados.length > 0 && (
        <div className='dropdown-profissionais'>
            {profissionaisFiltrados.map((profissional) => (
                <div 
                    key={profissional.id} // Use o ID do profissional
                    className='dropdown-item'
                    onClick={() => handleSelectProfissional(profissional)}
                >
                    {profissional.full_name}
                </div>
            ))}
        </div>
    )}
</div>
        
          <div  className="tipo_atendimento">
            <label>Tipo de atendimento *</label>
            <select onChange={handleChange} name="tipo_atendimento" >
              <option value="presencial" selected>Presencial</option>
              <option value="teleconsulta">Teleconsulta</option>
            </select>
          </div>

            
        </div>

        <section id="informacoes-atendimento-segunda-linha">
          <section id="informacoes-atendimento-segunda-linha-esquerda">
        
          <div className="campo-informacoes-atendimento">    

          
            <div className="campo-de-input">
              <label>Data *</label>
              <input type="date" name="dataAtendimento" value={agendamento.dataAtendimento} onChange={handleChange} required />
            </div>
          </div>


        <div className="row">
       <div className="campo-de-input">
          <label htmlFor="inicio">Início *</label>
          <select 
            id="inicio"
            name="inicio" 
            required
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
          >
            <option value="" disabled>Selecione a hora de início</option>
            {opcoesDeHorario?.map((opcao, index) => (
              <option 
                key={index} 
                value={opcao.value} 
                disabled={opcao.disabled}
              >
                {opcao.label}
                {opcao.disabled && " (Indisponível)"} 
              </option>
            ))}
          </select>
        </div>

        <div>

        </div>

       

        {/* Dropdown de Término */}
        <div className="campo-de-input">
          <label htmlFor="termino">Término *</label>
          <select 
            id="termino"
            name="termino" 
            required
            value={horarioTermino}
            onChange={(e) => setHorarioTermino(e.target.value)}
          >
            <option value="" disabled>Selecione a hora de término</option>
            {opcoesDeHorario?.map((opcao, index) => (
              <option 
                key={index} 
                value={opcao.value} 
                disabled={opcao.disabled}
              >
                {opcao.label}
                {opcao.disabled && " (Indisponível)"} 
              </option>
            ))}
          </select>
        </div>
        </div>
      
      
    
      </section>

      <section className="informacoes-atendimento-segunda-linha-direita"> 
     

        <div className="campo-de-input">
          <label>Observações</label>
          <textarea name="observacoes" rows="4" cols="1"></textarea>
        </div>
      </section>
    </section>

      <div className="form-actions">
        <button type="submit" className="btn-primary">Salvar agendamento</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
      
    </div>
  );
};

export default FormConsultaPaciente;