// src/components/FormCriarExcecao.jsx

import React, { useState } from "react";
// Assumindo que você usa o mesmo estilo
import "./AgendarConsulta/style/formagendamentos.css"; 

const ENDPOINT_CRIAR_EXCECAO = "https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_exceptions";

const FormCriarExcecao = ({ onCancel, doctorID }) => {

    const [dadosAtendimento, setDadosAtendimento] = useState({
        profissional: doctorID || '',
        tipoAtendimento: '',
        dataAtendimento: '',
        inicio: '',
        termino: '',
        motivo: ''
    });

    const handleAtendimentoChange = (e) => {
        const { value, name } = e.target;
        setDadosAtendimento(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitExcecao = async (e) => { 
        e.preventDefault();
        console.log("Tentando criar Exceção.");

        const { profissional, dataAtendimento, tipoAtendimento, inicio, termino, motivo } = dadosAtendimento;

        // Validação
        if (!profissional || !dataAtendimento || !tipoAtendimento || !motivo) {
            alert("Por favor, preencha o ID do Profissional, Data, Tipo e Motivo.");
            return;
        }
        
        // Adiciona ":00" se o campo de hora estiver preenchido
        const startTime = inicio ? inicio + ":00" : undefined; 
        const endTime = termino ? termino + ":00" : undefined;
        
        const payload = {
            doctor_id: profissional,
            date: dataAtendimento,
            start_time: startTime, 
            end_time: endTime,
            kind: tipoAtendimento, 
            reason: motivo,
        };
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        }; 

        try {
            const response = await fetch(ENDPOINT_CRIAR_EXCECAO, requestOptions);
            const resultText = await response.text(); 
            let result;
            try {
                result = JSON.parse(resultText);
            } catch {
                result = { message: resultText || 'Sucesso, mas resposta não é JSON.' };
            }

            if (response.ok || response.status === 201) {
                console.log("Exceção criada com sucesso:", result);
                alert(`Exceção criada! Detalhes: ${result.id || JSON.stringify(result)}`);
                onCancel(true); // Indica sucesso para o componente pai recarregar
            } else {
                console.error("Erro ao criar exceção:", result);
                alert(`Erro ao criar exceção. Status: ${response.status}. Detalhes: ${result.message || JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error("Erro na requisição para criar exceção:", error);
            alert("Erro de comunicação com o servidor.");
        }
    };

    return (
        <div className="form-container">
            <form className="form-agendamento" onSubmit={handleSubmitExcecao}>
                <h2 className="section-title">Informações da Nova Exceção</h2>

                <div className="campo-informacoes-atendimento">

                    <div className="campo-de-input">
                        <label>ID do profissional *</label>
                        <input 
                            type="text" 
                            name="profissional" 
                            required 
                            value={dadosAtendimento.profissional}
                            onChange={handleAtendimentoChange}
                        />
                    </div>

                    <div className="campo-de-input">
                        <label>Tipo de exceção *</label>
                        <select name="tipoAtendimento" onChange={handleAtendimentoChange} value={dadosAtendimento.tipoAtendimento} required>
                            <option value="" disabled selected>Selecione o tipo de exceção</option>
                            <option value="liberacao" >Liberação (Criar Slot)</option>
                            <option value="bloqueio" >Bloqueio (Remover Slot)</option>
                        </select>
                    </div>

                </div>

                <section id="informacoes-atendimento-segunda-linha">
                    <section id="informacoes-atendimento-segunda-linha-esquerda">
                    
                        <div className="campo-informacoes-atendimento">
                            
                            <div className="campo-de-input">
                                <label>Data *</label>
                                <input
                                    type="date"
                                    name="dataAtendimento"
                                    required 
                                    value={dadosAtendimento.dataAtendimento}
                                    onChange={handleAtendimentoChange}
                                />
                            </div>
                        </div>

                        <div className="campo-informacoes-atendimento">
                            <div className="campo-de-input">
                                <label>Início (Opcional)</label>
                                <input 
                                    type="time" 
                                    name="inicio" 
                                    value={dadosAtendimento.inicio}
                                    onChange={handleAtendimentoChange}
                                />
                            </div>

                            <div className="campo-de-input">
                                <label>Término (Opcional)</label>
                                <input 
                                    type="time" 
                                    name="termino"  
                                    value={dadosAtendimento.termino}
                                    onChange={handleAtendimentoChange}
                                />
                            </div>
                        
                            <div className="campo-de-input">
                                {/* Removendo o campo solicitante, pois não está no payload da API de exceções */}
                            </div>
                        </div>
                    </section>

                    <section className="informacoes-atendimento-segunda-linha-direita"> 
                        <div className="campo-de-input">
                            <label>Motivo da exceção *</label>
                            <textarea 
                                name="motivo" 
                                rows="4" 
                                cols="1"
                                required
                                value={dadosAtendimento.motivo}
                                onChange={handleAtendimentoChange}
                            ></textarea>
                        </div>
                    </section>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">Criar Exceção</button>
                    <button type="button" className="btn-cancel" onClick={() => onCancel(false)}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default FormCriarExcecao;