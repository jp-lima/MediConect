import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import FormCriarExcecao from '../components/FormCriarExcecao';
import "../components/AgendarConsulta/style/formagendamentos.css";
import "./style/Agendamento.css";
import './style/FilaEspera.css';

const ENDPOINT_LISTAR = "https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_exceptions";
const ENDPOINT_DELETAR = "https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_exceptions/";

const ExcecoesDisponibilidade = () => {

    const [pageNovaExcecao, setPageNovaExcecao] = useState(false);
    const [excecoes, setExcecoes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Filtros
    const [filtroMedicoId, setFiltroMedicoId] = useState('');
    const [filtroData, setFiltroData] = useState(dayjs().format('YYYY-MM-DD'));
    
    // Estado para controlar a visualização (Diário, Semanal)
    const [visualizacao, setVisualizacao] = useState('diario');

    // Função para buscar as exceções
    const fetchExcecoes = useCallback(async (doctorId, date) => {
        setLoading(true);
        let url = `${ENDPOINT_LISTAR}?select=*`;
        
        if (doctorId) {
            url += `&doctor_id=eq.${doctorId}`; // Assume filtro por igualdade de ID
        }
        if (date) {
            url += `&date=eq.${date}`; // Assume filtro por igualdade de data
        }

        try {
            const requestOptions = { method: 'GET', redirect: 'follow' };
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            
            if (response.ok && Array.isArray(result)) {
                setExcecoes(result);
            } else {
                setExcecoes([]);
                console.error("Erro ao listar exceções:", result);
                alert("Erro ao carregar lista de exceções.");
            }
        } catch (error) {
            console.error('Erro na requisição de listagem de exceções:', error);
            setExcecoes([]);
            alert("Erro de comunicação com o servidor ao listar exceções.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para deletar uma exceção
    const deletarExcecao = async (id) => {
        if (!window.confirm(`Tem certeza que deseja deletar a exceção com ID: ${id}?`)) return;

        try {
            const requestOptions = { method: 'DELETE', redirect: 'follow' };
            const response = await fetch(`${ENDPOINT_DELETAR}${id}`, requestOptions);

            if (response.ok || response.status === 204) {
                alert(`Exceção ${id} deletada com sucesso.`);
                fetchExcecoes(filtroMedicoId, filtroData); // Recarrega a lista
            } else {
                const result = await response.json();
                alert(`Erro ao deletar exceção. Detalhes: ${result.message || JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error('Erro na requisição de deleção:', error);
            alert('Erro de comunicação ao tentar deletar a exceção.');
        }
    };

    // Efeito para carregar exceções quando os filtros mudam
    useEffect(() => {
        fetchExcecoes(filtroMedicoId, filtroData);
    }, [fetchExcecoes, filtroMedicoId, filtroData]);

    // Handler de cancelamento do formulário de criação
    const handleCancelForm = (recarregar = false) => {
        setPageNovaExcecao(false);
        if (recarregar) {
            fetchExcecoes(filtroMedicoId, filtroData); // Recarrega se a criação foi bem-sucedida
        }
    }

    // Se o formulário de criação estiver aberto, renderiza apenas ele
    if (pageNovaExcecao) {
        return <FormCriarExcecao onCancel={handleCancelForm} doctorID={filtroMedicoId} />;
    }

    // Renderiza a tela de listagem (layout da agenda)
    
    return (
        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1>Gerenciar Exceções de Disponibilidade</h1>
                <button 
                    className="btn-primary" 
                    onClick={() => setPageNovaExcecao(true)}
                    // Use a classe btn-primary que deve estar funcionando
                    style={{ padding: '10px 20px', fontSize: '14px', whiteSpace: 'nowrap' }} 
                >
                + Criar Nova Exceção
                </button>
            </div>
            <div className='atendimento-eprocura'>
                
                {/* Filtros e Busca (Adaptados do Agendamento) */}
                <div className='busca-atendimento'>
                    <div>
                        <i className="fa-solid fa-user-doctor"></i>
                        <input
                            type="text"
                            placeholder="Filtrar por ID do Médico..."
                            value={filtroMedicoId}
                            onChange={(e) => setFiltroMedicoId(e.target.value)}
                        />
                    </div>
                    <div>
                        <i className="fa-solid fa-calendar"></i>
                         <input
                            type="date"
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Botões de Visualização (Dia/Semana/Mês) - Adaptados */}
                <div className='container-btns-agenda-fila_esepera'>
                    <button
                        className={`btn-agenda ${visualizacao === "diario" ? "opc-agenda-ativo" : ""}`}
                        onClick={() => setVisualizacao('diario')}
                    >
                        Dia
                    </button>
                    <button
                        className={`btn-fila-espera ${visualizacao === "semanal" ? "opc-filaespera-ativo" : ""}`}
                        onClick={() => setVisualizacao('semanal')}
                    >
                        Semana
                    </button>
                    <button
                        className={`btn-fila-espera ${visualizacao === "mensal" ? "opc-filaespera-ativo" : ""}`}
                        onClick={() => setVisualizacao('mensal')}
                    >
                        Mês
                    </button>
                </div>
                
                {/* Tabela de Exceções (Simulando a Tabela de Agendamentos) */}
                <section className='calendario-ou-filaespera'>
                    <div className="fila-container">
                        <h2 className="fila-titulo">Exceções em {filtroData} ({excecoes.length})</h2>
                        {loading ? (
                            <p>Carregando exceções...</p>
                        ) : excecoes.length === 0 ? (
                            <p>Nenhuma exceção encontrada para os filtros aplicados.</p>
                        ) : (
                            <table className="fila-tabela">
                                <thead>
                                    <tr>
                                        <th>ID Exceção</th>
                                        <th>ID Médico</th>
                                        <th>Data</th>
                                        <th>Início</th>
                                        <th>Término</th>
                                        <th>Tipo</th>
                                        <th>Motivo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {excecoes.map((excecao, index) => (
                                        <tr key={excecao.id || index}>
                                            <td>{excecao.id || 'N/A'}</td>
                                            <td>{excecao.doctor_id}</td>
                                            <td>{excecao.date}</td>
                                            <td>{excecao.start_time ? excecao.start_time.substring(0, 5) : 'Dia Todo'}</td>
                                            <td>{excecao.end_time ? excecao.end_time.substring(0, 5) : 'Dia Todo'}</td>
                                            <td>
                                                <span className={`status-tag ${excecao.kind === 'bloqueio' ? 'legenda-item-cancelado' : 'legenda-item-realizado'}`}>
                                                    {excecao.kind}
                                                </span>
                                            </td>
                                            <td>{excecao.reason}</td>
                                            <td>
                                                {excecao.id && (
                                                    <button 
                                                        onClick={() => deletarExcecao(excecao.id)}
                                                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                                    >
                                                        Deletar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ExcecoesDisponibilidade;