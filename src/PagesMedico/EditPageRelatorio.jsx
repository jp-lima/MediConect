import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom' 
import API_KEY from '../components/utils/apiKeys'
import { useAuth } from '../components/utils/AuthProvider'
import TiptapEditor from '../PagesMedico/TiptapEditor' 
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient' 

const EditPageRelatorio = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {getAuthorizationHeader} = useAuth()
  let authHeader = getAuthorizationHeader()
  
  const [relatorioData, setRelatorioData] = useState({
    patient_id: '',
    exam: '',
    // Mantemos apenas os campos necessários para o fetch, mas não para edição direta na UI
    required_by: '',
    address_line: '',
    content: '', 
  }) 
  const [loading, setLoading] = useState(true)
  const [patientData, setPatientData] = useState(null) // Armazena dados do paciente
  const RelatorioID = params.id
  
  // Modelo HTML do relatório para ser carregado no Tiptap se o conteúdo for novo/vazio
  const generateReportModel = (report, patient) => {
    // Escapa as aspas se necessário, mas para HTML simples não é crucial
    const patientName = patient?.full_name || 'Paciente não encontrado';
    const birthDate = patient?.birth_date || 'Data não informada';
    const exam = report?.exam || 'Exame não especificado';

    return `
      <div>
        <p style="text-align: center; font-weight: bold;">Clinica Rise up</p>
        <p style="text-align: center;">Dr - CRM/SP 123456</p>
        <p style="text-align: center;">Avenida - (79) 9 4444-4444</p>
        <br>
        <p><strong>Paciente:</strong> ${patientName}</p>
        <p><strong>Data de nascimento:</strong> ${birthDate}</p>
        <p><strong>Data do exame:</strong> </p>
        <p><strong>Exame:</strong> ${exam}</p>
        <br>
        <p><strong>Conteúdo do Relatório:</strong></p>
        <p>1</p>
        <br>
        <p>Dr</p>
        <p>Emitido em: 0</p>
      </div>
    `;
  };
  
  // Função que será chamada ao salvar
  const handleSave = () => {
    setLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);
    myHeaders.append("Authorization", authHeader);
    myHeaders.append("Content-Type", "application/json");

    // Salva apenas o novo conteúdo do Tiptap (relatorioData.content)
    const raw = JSON.stringify({
        content: relatorioData.content, 
        // Você pode manter order_number ou removê-lo se não for editável
        order_number: relatorioData.order_number || 'REL-2025-4386' 
    })
    
    var requestOptions = {
       method: 'PATCH',
       headers: myHeaders,
       body: raw,
       redirect: 'follow'
    };
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${RelatorioID}`, requestOptions)
      .then(response => response.text())
      .then(result => {
          console.log(result); 
          alert('Relatório atualizado com sucesso!');
          setLoading(false)
          // MANTIDO: Volta para a área de relatórios
          navigate('/medico/relatorios') 
      })
      .catch(error => {
          console.log('error', error);
          alert('Erro ao atualizar o relatório.');
          setLoading(false)
      });
  }

  // Busca os dados do Relatório e do Paciente
  useEffect(() => {
    const fetchReportData = async () => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", API_KEY);
        myHeaders.append("Authorization", authHeader);
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        let report;
        let patient;
        try {
            const response = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${RelatorioID}`, requestOptions);
            const result = await response.json();
            
            if (result.length > 0) {
                report = result[0];
                
                // Busca nome do paciente
                const patientResult = await GetPatientByID(report.patient_id, authHeader);
                if (patientResult.length > 0) {
                    patient = patientResult[0];
                    setPatientData(patient);
                }

                // Determina o conteúdo inicial
                let initialContent = report.content || report.diagnosis || report.conclusion || '';
                
                // Se o conteúdo estiver vazio, carrega o modelo do relatório completo
                if (!initialContent.trim()) {
                   initialContent = generateReportModel(report, patient);
                }

                setRelatorioData({
                    ...report,
                    content: initialContent,
                });
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false)
        }
    }
    fetchReportData()
  }, [RelatorioID, authHeader])

  // Função para atualizar o HTML do editor
  const handleEditorChange = (newHtml) => {
    setRelatorioData(prev => ({ ...prev, content: newHtml }))
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className='container'>
      {/* MANTIDO: Título limpo */}
      <h3 className='mb-4'>Editar Relatório do Paciente: {patientData?.full_name}</h3> 
      
      {/* MUDANÇA: Removidos todos os inputs de texto avulsos */}

      {/* Campo do Tiptap Editor */}
      <div className='mb-3'>
        {/* MUDANÇA: Título ajustado */}
        <h5 className='mb-2'>Conteúdo do Relatório</h5> 
        <TiptapEditor 
          content={relatorioData.content} 
          onChange={handleEditorChange}
        />
      </div>
      <button className='btn btn-success' onClick={handleSave}>
        Salvar Relatório
      </button>
      
    </div>
  )
}

export default EditPageRelatorio