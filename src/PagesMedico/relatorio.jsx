import React, { useState } from 'react';
import './styleMedico/geral.css';

const mockData = {
  atendimentos: [
    { id: 1, paciente: 'Carlos Andrade', data: '2025-09-25', motivo: 'Consulta de rotina', medico: 'Dr. House' },
    { id: 2, paciente: 'Beatriz Costa', data: '2025-09-24', motivo: 'Retorno', medico: 'Dr. Wilson' },
    { id: 3, paciente: 'Juliana Ferreira', data: '2025-09-23', motivo: 'Exames de sangue', medico: 'Dr. House' },
    { id: 4, paciente: 'Marcos Souza', data: '2025-09-22', motivo: 'Consulta de rotina', medico: 'Dr. Cuddy' },
  ],
  pacientes: [
    { id: 1, nome: 'Carlos Andrade', idade: 45, cadastro: '2024-03-10' },
    { id: 2, nome: 'Beatriz Costa', idade: 29, cadastro: '2023-11-20' },
    { id: 3, nome: 'Juliana Ferreira', idade: 34, cadastro: '2025-01-15' },
    { id: 4, nome: 'Marcos Souza', idade: 52, cadastro: '2022-07-01' },
    { id: 5, nome: 'Fernanda Lima', idade: 25, cadastro: '2025-08-05' },
  ],
};

function Relatorio() {
  // ...restante do código igual...
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [dados, setDados] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleGerarRelatorio = () => {
    if (!tipoRelatorio) {
      alert('Por favor, selecione um tipo de relatório.');
      return;
    }
    setDados(mockData[tipoRelatorio] || []);
  };

  const renderizarTabela = () => {
    if (!dados) {
      return <p className="info-text">Selecione os filtros e clique em "Gerar Relatório" para começar.</p>;
    }

    if (dados.length === 0) {
      return <p className="info-text">Nenhum dado encontrado para os filtros selecionados.</p>;
    }

    const headers = Object.keys(dados[0]);

    return (
      <table>
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header.toUpperCase()}</th>)}
          </tr>
        </thead>
        <tbody>
          {dados.map(item => (
            <tr key={item.id}>
              {headers.map(header => <td key={`${item.id}-${header}`}>{item[header]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="relatorios-container">
      <h1>Página de Relatórios</h1>

      <div className="filtros-container">
        <div className="filtro-item">
          <label htmlFor="tipoRelatorio">Tipo de Relatório</label>
          <select 
            id="tipoRelatorio" 
            value={tipoRelatorio} 
            onChange={(e) => setTipoRelatorio(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="atendimentos">Relatório de Atendimentos</option>
            <option value="pacientes">Relatório de Pacientes</option>
          </select>
        </div>
        
        <div className="filtro-item">
          <label htmlFor="dataInicio">Data de Início</label>
          <input 
            type="date" 
            id="dataInicio" 
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="filtro-item">
          <label htmlFor="dataFim">Data Final</label>
          <input 
            type="date" 
            id="dataFim" 
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <button onClick={handleGerarRelatorio} className="btn-gerar">
          Gerar Relatório
        </button>
      </div>

      <div className="resultado-container">
        <h2>Resultado</h2>
        {renderizarTabela()}
      </div>
    </div>
  );
}

export default Relatorio;