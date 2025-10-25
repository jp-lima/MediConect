// EditPageRelatorio.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_KEY from '../components/utils/apiKeys';
import { useAuth } from '../components/utils/AuthProvider';
import TiptapEditor from '../PagesMedico/TiptapEditor';
import { GetPatientByID } from '../components/utils/Functions-Endpoints/Patient';
import { GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor';

const EditPageRelatorio = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { getAuthorizationHeader } = useAuth();
  const authHeader = getAuthorizationHeader();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [html, setHtml] = useState('');

  const generateTemplate = (r = {}, p = {}, d = {}) => {
    const patientName = p?.full_name || '[NOME DO PACIENTE]';
    const birthDate = p?.birth_date || '';
    const exam = r?.exam || '';
    const doctorName = d?.full_name || r?.requested_by || '';
    return `
      <div>
        <p style="text-align:center; font-weight:bold;">Clinica Rise up</p>
        <p style="text-align:center;">Dr - CRM/SP 123456</p>
        <p style="text-align:center;">Avenida - (79) 9 4444-4444</p>
        <br/>
        <p><strong>Paciente:</strong> ${patientName}</p>
        <p><strong>Data de nascimento:</strong> ${birthDate}</p>
        <p><strong>Data do exame:</strong></p>
        <p><strong>Exame:</strong> ${exam}</p>
        <br/>
        <p style="font-weight:bold;">Diagnóstico:</p>
        <p>${r?.diagnosis || ''}</p>
        <br/>
        <p style="font-weight:bold;">Conclusão:</p>
        <p>${r?.conclusion || ''}</p>
        <br/>
        <p>Dr ${doctorName}</p>
        <p>Emitido em: 0</p>
      </div>
    `;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("apikey", API_KEY);
        myHeaders.append("Authorization", authHeader);
        const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };

        // Pega relatório por id (supabase geralmente retorna array para ?id=eq.X)
        const resp = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${params.id}`, requestOptions);
        const data = await resp.json();
        const rep = Array.isArray(data) ? data[0] : data;
        if (!rep) throw new Error('Relatório não encontrado');

        setReport(rep);

        // busca paciente
        if (rep.patient_id) {
          const p = await GetPatientByID(rep.patient_id, authHeader);
          setPatient(Array.isArray(p) ? p[0] : p);
        }

        // busca doctor se tiver created_by/requested_by id (tentamos fallback)
        if (rep.created_by) {
          try {
            const d = await GetDoctorByID(rep.created_by, authHeader);
            setDoctor(Array.isArray(d) ? d[0] : d);
          } catch (e) {
            // ignore
          }
        }

        // content_html preferencial
        let initial = rep.content_html || rep.content || rep.diagnosis || rep.conclusion || '';
        if (!initial || initial.trim() === '') {
          initial = generateTemplate(rep, patient || {}, doctor || {});
        }
        setHtml(initial);
      } catch (err) {
        console.error('Erro carregar relatório', err);
        alert('Erro ao carregar relatório. Veja console.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [params.id, authHeader]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append('apikey', API_KEY);
      myHeaders.append('Authorization', authHeader);
      myHeaders.append('Content-Type', 'application/json');

      const body = JSON.stringify({ content_html: html });

      // supabase: PATCH via query id=eq.<id>
      const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?id=eq.${params.id}`, {
        method: 'PATCH',
        headers: myHeaders,
        body
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Erro PATCH', res.status, txt);
        throw new Error('Erro na API');
      }

      alert('Relatório atualizado com sucesso!');
      navigate('/medico/relatorios');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar. Veja console.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className='container'>
      <h3 className='mb-4'>Editar Relatório do Paciente: {patient?.full_name || '...'}</h3>

      <div className='mb-3'>
        <h5 className='mb-2'>Conteúdo do Relatório</h5>
        <TiptapEditor content={html} onChange={(newHtml) => setHtml(newHtml)} />
      </div>

      <div className='d-flex justify-content-center mt-4'>
        <button className='btn btn-success' onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Relatório'}
        </button>
      </div>
    </div>
  );
};

export default EditPageRelatorio;

