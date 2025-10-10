import React from 'react'
import '../PagesMedico/styleMedico/FormNovoRelatorio.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/utils/AuthProvider'
import { GetPatientByCPF } from '../components/utils/Functions-Endpoints/Patient'
import { FormatCPF } from '../components/utils/Formatar/Format'
import html2pdf from 'html2pdf.js'

const FormRelatorio = ({onSave, DictInfo, setDictInfo }) => {
    const {getAuthorizationHeader} = useAuth()
    let authHeader = getAuthorizationHeader()
  const navigate= useNavigate()
    
    const [showModal, setShowModal] = useState(false)

    const BaixarPDFdoRelatorio = () => {
        const elemento = document.getElementById("folhaA4"); // tua div do relatório
    const opt = {
    margin: 0,
    filename: `relatorio_${DictInfo?.paciente_nome || "paciente"}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(elemento).save();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        if(name === 'paciente_cpf') {
          const formattedCPF = FormatCPF(value);
          setDictInfo((prev) => ({ ...prev, [name]: formattedCPF }));

          const fetchPatient = async () => {
            const patientData = await GetPatientByCPF(formattedCPF, authHeader);
            if (patientData) {
              setDictInfo((prev) => ({
                ...prev,
                paciente_cpf:value,
                paciente_nome: patientData.full_name,
                paciente_id: patientData.id
              }));
            }
           
          };
          if(formattedCPF.length === 14){
          fetchPatient();
          }
        }else{
          setDictInfo((prev) => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(DictInfo)
        setShowModal(true)
       

onSave({
   "patient_id": DictInfo.paciente_id,
   
   "exam": DictInfo.exam,
   "diagnosis": DictInfo.diagnosis,
   "conclusion": DictInfo.conclusao,
   "status": "draft",
   "requested_by": DictInfo.requested_by,
   
   "hide_date": false,
   "hide_signature": false,
});

    }

  return (
    <div>
       {showModal &&(
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title ">Relatório criado com sucesso</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Você também pode baixa-lo agora em pdf</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={ BaixarPDFdoRelatorio}><i className='bi bi-file-pdf-fill'></i> baixar em pdf</button>

                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => {setShowModal(false); navigate(('/medico/relatorios'))}}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        

    <div className='card'>

        <form action="" onSubmit={handleSubmit}>
            <div id='primeiraLinha'>

                <div className="col-md-2 mb-3">
                    <label >Nome do paciente:</label>
                    <input type="text" step="0.1" className="form-control" name="paciente_nome" onChange={handleChange} value={DictInfo.paciente_nome || ''}  required />
                </div>

            <div className="col-md-2 mb-3">
                <label >CPF do paciente:</label>
                <input type="text" step="0.1" className="form-control" name="paciente_cpf" onChange={handleChange} value={DictInfo.paciente_cpf || ''}  required />
                </div>
          
            
            <div className="col-md-2 mb-3">
                <label >Nome do médico:</label>
                <input type="text" step="0.1" className="form-control" name="requested_by" onChange={handleChange} value={DictInfo.requested_by || ''}   required />
            </div>
            
            <div className="col-md-2 mb-3">
              <label >Exame:</label>
              <input type="text" className="form-control" name="exam" onChange={handleChange}   />
            </div>

            
            <div className="col-md-2 mb-3">
              <label >Data do exame:</label>
              <input type="date" className="form-control" name="data_exame" onChange={handleChange} value={DictInfo.data_exame || ''}   />
            </div>
           
        </div>

        <div className='row'>
            <div className="col-md-2 mb-3">
              <label htmlFor='diagnostico'>Diagnostico:</label>
              <textarea name="diagnostico" id="diagnostico" onChange={handleChange} cols="30" rows="5" value={DictInfo.diagnostico || ''}></textarea>
            </div>

            <div className="col-md-2 mb-3">
              <label htmlFor='conclusao'>Conclusão:</label>
             <textarea name="conclusao" id="conclusao" onChange={handleChange} cols="30" rows="5" value={DictInfo.conclusao || ''}></textarea>
             </div>
        </div>

         <button
            className="btn btn-success  submitButton"
            type='submit'
          >
            Salvar
          </button>
                
    </form>    
    </div>

    <h3>Modelo do relatório</h3>
  <div id="folhaA4">

    <div id='header-relatorio'>
        <p>Clinica Rise up</p>
        <p>Dr {DictInfo.requested_by} - CRM/SP 123456</p>
        <p>Avenida - (79) 9 4444-4444</p>
    </div>

    <div id='infoPaciente'>
        <p>Paciente: {DictInfo?.paciente_nome}</p>
        <p>Data de nascimento: </p>

        <p>Data do exame: {DictInfo.data_exam}</p>

        <p>Exame: {DictInfo.exam}</p>

        <p>Diagnostico: {DictInfo.diagnostico}</p>

        <p>Conclusão: {DictInfo.conclusao}</p>
     
    </div>

    <div>
        <p>Dr {DictInfo.requested_by}</p>
        <p>Emitido em: 0</p>
    </div>

  </div>
  
  </div>
  )
}

export default FormRelatorio