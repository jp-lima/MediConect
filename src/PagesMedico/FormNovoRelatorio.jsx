import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_KEY from '../components/utils/apiKeys';
import { useAuth } from '../components/utils/AuthProvider';
import TiptapEditor from './TiptapEditor';
import { GetAllPatients, GetPatientByID } from '../components/utils/Functions-Endpoints/Patient';
import { GetAllDoctors, GetDoctorByID } from '../components/utils/Functions-Endpoints/Doctor';
import './styleMedico/FormNovoRelatorio.css';

const FormNovoRelatorio = () => {
  const { getAuthorizationHeader } = useAuth();
  const authHeader = getAuthorizationHeader();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // formulário
  const [form, setForm] = useState({
    patient_id: '',
    patient_name: '',
    patient_birth: '',
    doctor_id: '',
    doctor_name: '',
    contentHtml: '',
  });

  // campos de busca (texto)
  const [patientQuery, setPatientQuery] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('');

  // dropdown control
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  const patientRef = useRef();
  const doctorRef = useRef();

  useEffect(() => {
    // carregar pacientes
    let mounted = true;
    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const list = await GetAllPatients(authHeader);
        if (mounted && Array.isArray(list)) setPatients(list);
      } catch (err) {
        console.error('Erro GetAllPatients:', err);
      } finally {
        if (mounted) setLoadingPatients(false);
      }
    };
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const list = await GetAllDoctors(authHeader);
        if (mounted && Array.isArray(list)) setDoctors(list);
      } catch (err) {
        console.error('Erro GetAllDoctors:', err);
      } finally {
        if (mounted) setLoadingDoctors(false);
      }
    };
    loadPatients();
    loadDoctors();
    return () => { mounted = false; };
  }, [authHeader]);

  // fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClick = (e) => {
      if (patientRef.current && !patientRef.current.contains(e.target)) setShowPatientDropdown(false);
      if (doctorRef.current && !doctorRef.current.contains(e.target)) setShowDoctorDropdown(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const generateTemplate = (patientName = '', birthDate = '', doctorName = '') => {
    return `
      <div>
        <p style="text-align:center; font-weight:bold;">Clinica Rise up</p>
        <p style="text-align:center;">Dr - CRM/SP 123456</p>
        <p style="text-align:center;">Avenida - (79) 9 4444-4444</p>
        <br/>
        <p><strong>Paciente:</strong> ${patientName}</p>
        <p><strong>Data de nascimento:</strong> ${birthDate}</p>
        <p><strong>Data do exame:</strong> </p>
        <p><strong>Exame:</strong> </p>
        <br/>
        <p><strong>Diagnóstico:</strong></p>
        <p></p>
        <br/>
        <p><strong>Conclusão:</strong></p>
        <p></p>
        <br/>
        <p>Dr ${doctorName}</p>
        <p>Emitido em: 0</p>
      </div>
    `;
  };

  // escolher paciente (clicando na lista)
  const choosePatient = async (patient) => {
    setForm(prev => ({
      ...prev,
      patient_id: patient.id,
      patient_name: patient.full_name || '',
      patient_birth: patient.birth_date || '',
      contentHtml: generateTemplate(patient.full_name || '', patient.birth_date || '', form.doctor_name)
    }));
    setPatientQuery('');
    setShowPatientDropdown(false);
  };

  const chooseDoctor = (doctor) => {
    setForm(prev => ({
      ...prev,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name || '',
      contentHtml: generateTemplate(form.patient_name, form.patient_birth, doctor.full_name || '')
    }));
    setDoctorQuery('');
    setShowDoctorDropdown(false);
  };

  // filtrar pela query (startsWith)
  const filteredPatients = patientQuery
    ? patients.filter(p => (p.full_name || '').toLowerCase().startsWith(patientQuery.toLowerCase())).slice(0, 40)
    : [];

  const filteredDoctors = doctorQuery
    ? doctors.filter(d => (d.full_name || '').toLowerCase().startsWith(doctorQuery.toLowerCase())).slice(0, 40)
    : [];

  const handleEditorChange = (html) => setForm(prev => ({ ...prev, contentHtml: html }));

  // salvar novo relatório
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient_id) return alert('Selecione o paciente (clicando no item) antes de salvar.');
    if (!form.doctor_id) return alert('Selecione o médico (clicando no item) antes de salvar.');

    try {
      const myHeaders = new Headers();
      myHeaders.append('apikey', API_KEY);
      myHeaders.append('Authorization', authHeader);
      myHeaders.append('Content-Type', 'application/json');

      const body = JSON.stringify({
        patient_id: form.patient_id,
        content: form.contentHtml,
        content_html: form.contentHtml,
        requested_by: form.doctor_name || '',
        created_by: form.doctor_id || null,
        status: 'draft'
      });

      const res = await fetch('https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports', {
        method: 'POST',
        headers: myHeaders,
        body,
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Erro POST criar relatório:', res.status, txt);
        // mostra mensagem mais útil
        return alert(`Erro ao criar relatório (ver console). Status ${res.status}`);
      }

      alert('Relatório criado com sucesso!');
      navigate('/medico/relatorios');
    } catch (err) {
      console.error('Erro salvar relatório:', err);
      alert('Erro ao salvar relatório. Veja console.');
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Criar Novo Relatório</h3>

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6" ref={patientRef}>
            <label className="form-label">Buscar paciente (digite para filtrar)</label>
            <input
              className="form-control"
              placeholder="Comece a digitar (ex.: m para pacientes que começam com m)"
              value={patientQuery}
              onChange={(e) => { setPatientQuery(e.target.value); setShowPatientDropdown(true); }}
              onFocus={() => setShowPatientDropdown(true)}
            />
            {showPatientDropdown && patientQuery && (
              <ul className="list-group position-absolute" style={{ zIndex: 50, maxHeight: 220, overflowY: 'auto', width: '45%' }}>
                {filteredPatients.length > 0 ? filteredPatients.map(p => (
                  <li key={p.id} className="list-group-item list-group-item-action" onClick={() => choosePatient(p)}>
                    {p.full_name} {p.cpf ? `- ${p.cpf}` : ''}
                  </li>
                )) : <li className="list-group-item">Nenhum paciente começando com "{patientQuery}"</li>}
              </ul>
            )}
            <div className="form-text">Clique no paciente desejado para selecioná-lo e preencher o template.</div>
          </div>

          <div className="col-md-6" ref={doctorRef}>
            <label className="form-label">Buscar médico (digite para filtrar)</label>
            <input
              className="form-control"
              placeholder="Comece a digitar o nome do médico"
              value={doctorQuery}
              onChange={(e) => { setDoctorQuery(e.target.value); setShowDoctorDropdown(true); }}
              onFocus={() => setShowDoctorDropdown(true)}
            />
            {showDoctorDropdown && doctorQuery && (
              <ul className="list-group position-absolute" style={{ zIndex: 50, maxHeight: 220, overflowY: 'auto', width: '45%', right: 0 }}>
                {filteredDoctors.length > 0 ? filteredDoctors.map(d => (
                  <li key={d.id} className="list-group-item list-group-item-action" onClick={() => chooseDoctor(d)}>
                    {d.full_name} {d.crm ? `- CRM ${d.crm}` : ''}
                  </li>
                )) : <li className="list-group-item">Nenhum médico começando com "{doctorQuery}"</li>}
              </ul>
            )}
            <div className="form-text">Clique no médico desejado para selecioná-lo.</div>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success">Salvar Relatório</button>
          </div>
        </div>

        <hr className="my-3" />
        <h5>Conteúdo do Relatório (edite tudo aqui)</h5>
        <TiptapEditor content={form.contentHtml || generateTemplate(form.patient_name, form.patient_birth, form.doctor_name)} onChange={handleEditorChange} />
      </form>
    </div>
  );
};

export default FormNovoRelatorio;
