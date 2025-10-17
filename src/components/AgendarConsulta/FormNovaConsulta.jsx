import InputMask from "react-input-mask";
import "./style/formagendamentos.css";
import { useState, useEffect } from "react";
import { GetPatientByCPF } from "../utils/Functions-Endpoints/Patient";
import { GetDoctorByName } from "../utils/Functions-Endpoints/Doctor";
import { useAuth } from "../utils/AuthProvider";

const FormNovaConsulta = ({ onCancel, onSave, setAgendamento, agendamento }) => {
  const {getAuthorizationHeader} = useAuth()

  const [selectedFile, setSelectedFile] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const [loadingAnexos, setLoadingAnexos] = useState(false);
  
  const [acessibilidade, setAcessibilidade] = useState({cadeirante:false,idoso:false,gravida:false,bebe:false, autista:false })
  let authHeader = getAuthorizationHeader()

  const handleclickAcessibilidade = (id) => {
    let resultado = acessibilidade[id]

    if(resultado === false){ setAcessibilidade({...acessibilidade, [id]:true}); console.log('mudou')}

    else if(resultado === true){ setAcessibilidade({...acessibilidade, [id]:false})}
    console.log(id)
  }
  

  const FormatCPF = (valor) => {
    const digits = String(valor).replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

     

  const handleChange = (e) => {
    const {value, name} = e.target;
    console.log(value, name)
    
    if(name === 'email'){
      setAgendamento({...agendamento, contato:{
        ...agendamento.contato,
        email:value
      }})

    }else if(name === 'cpf'){

      let cpfFormatted = FormatCPF(value)
       const fetchPatient = async () => {
                  let patientData = await GetPatientByCPF(cpfFormatted, authHeader);
                  if (patientData) {
                    setAgendamento((prev) => ({
                      ...prev,
                      nome: patientData.full_name,
                      patient_id: patientData.id
                    }));
                  }}
      setAgendamento(prev => ({ ...prev, cpf: cpfFormatted }))
      fetchPatient()
    }else if(name==='convenio'){
      setAgendamento({...agendamento,insurance_provider:value})
    }else if(name ==='profissional'){
      const fetchDoctor = async () => {
        let DoctorData =  await GetDoctorByName(value, authHeader)
        if(DoctorData){
         setAgendamento((prev) => ({
                      ...prev,
                      doctor_id:DoctorData.id
                    }))
      }}
      fetchDoctor()
    }
    else{
    setAgendamento({...agendamento,[name]:value})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Agendamento salvo!");
    onSave(agendamento)
  };

  return (
    <div className="form-container">
      

      <form className="form-agendamento" onSubmit={handleSubmit}>
        <h2 className="section-title">Informações do paciente</h2>

      <div className="campos-informacoes-paciente" id="informacoes-paciente-linha-um">
          
          <div className="campo-de-input">
            <label>CPF do paciente</label> 
               <input  type="text" name="cpf"  placeholder="000.000.000-00" onChange={handleChange}  value={agendamento.cpf}/>
           
          </div>
          
          <div className="campo-de-input">
            <label>Nome *</label>
            <input type="text" name="nome" value={agendamento.nome} placeholder="Insira o nome do paciente" required onChange={handleChange} />
          </div>        

         
      </div>

     

      <div className="campos-informacoes-paciente" id="informacoes-paciente-linha-tres">
       
        <div className="campo-de-input">
          <label>Convênio</label>
          <select name="convenio" onChange={handleChange}>
            <option value="publico">Público</option>
            <option value="unimed">Unimed</option>
            <option value="bradesco_saude">Bradesco Saúde</option>
            <option value="hapvida">Hapvida</option>
          </select>
        </div>
        
      </div>

        <h3 className="section-subtitle">Informações adicionais</h3>
      
          <label htmlFor="anexo-input" className="btn btn-secondary">Adicionar Anexo</label>
          <input
            type="file"
            id="anexo-input"
            className="d-none"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {selectedFile && (
            <button type="button" className="btn btn-primary ms-2" >
              Enviar
            </button>
          )}
        <div className="anexos-list">
        </div>
        <h2 className="section-title">Informações do atendimento</h2>
       
      
          <div className="icons-container">
        
            <div  className={`icons-div ${ acessibilidade.cadeirante === true ? 'acessibilidade-ativado' : ''} `} id='cadeirante' onClick={(e) => handleclickAcessibilidade(e.currentTarget.id)}>
              
              <span className="material-symbols-outlined icon">accessible</span>
            </div>

            <div className={`icons-div ${acessibilidade.idoso === true ? 'acessibilidade-ativado' : ''}`} id="idoso" onClick={(e) => handleclickAcessibilidade(e.currentTarget.id)}>
              <span className="material-symbols-outlined icon">elderly</span> 
            </div>
          
            <div className={`icons-div ${acessibilidade.gravida === true ? 'acessibilidade-ativado' : ''}`} id="gravida" onClick={(e) => handleclickAcessibilidade(e.currentTarget.id)}>
              <span className="material-symbols-outlined icon">pregnant_woman</span> 
            </div>
            
            <div className={`icons-div ${acessibilidade.bebe === true ? 'acessibilidade-ativado' : ''}`} id="bebe" onClick={(e) => handleclickAcessibilidade(e.currentTarget.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-baby-icon lucide-baby"><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/></svg>

            </div>

            <div className={`icons-div ${acessibilidade.autista === true ? 'acessibilidade-ativado' : ''}`} id="autista" onClick={(e) => handleclickAcessibilidade(e.currentTarget.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle-icon lucide-puzzle"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg>
            </div>
        
          </div>

        <div className="campo-informacoes-atendimento">
            
            <div className="campo-de-input">
              <label>Nome do profissional *</label>
              <input type="text" name="profissional" onChange={handleChange} value={agendamento.nome_medico}required />
            </div>
          

          <div className="campo-de-input">
            <label>Tipo de atendimento *</label>
            <select onChange={handleChange} >
              <option value="presencial" selected>Presencial</option>
              <option value="teleconsulta">Teleconsulta</option>
              

            </select>
          </div>
        </div>

        <section id="informacoes-atendimento-segunda-linha">
          <section id="informacoes-atendimento-segunda-linha-esquerda">
        
          <div className="campo-informacoes-atendimento">
            <div className='campo-de-input'>
              <label>Unidade *</label>
              <select name="unidade">
                <option value="" disabled invisible selected>Selecione a unidade</option>
                <option value="centro">Núcleo de Especialidades Integradas</option>
                <option value="leste">Unidade Leste</option>
              </select>
            </div>
          

          
            <div className="campo-de-input">
              <label>Data *</label>
              <input type="date" name="dataAtendimento" onChange={handleChange} required />
            </div>
          </div>

          <div className="campo-informacoes-atendimento">
            <div className="campo-de-input">
              <label>Início *</label>
              <input type="time" name="inicio" required />
            </div>

            <div className="campo-de-input">
              <label>Término *</label>
              <input type="time" name="termino" required />
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

export default FormNovaConsulta;