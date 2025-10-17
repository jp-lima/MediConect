import InputMask from "react-input-mask";
import "./style/formagendamentos.css";
import { useState, useEffect } from "react";

const FormNovaDisponibilidade = ({ onCancel, doctorID }) => {

  const [dadosAtendimento, setDadosAtendimento] = useState({
    profissional: '',
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
    console.log("Modo Emergência Ativado: Tentando criar Exceção com novo endpoint.");

    const { profissional, dataAtendimento, tipoAtendimento, inicio, termino, motivo } = dadosAtendimento;

    if (!profissional || !dataAtendimento || !tipoAtendimento) {
        alert("Por favor, preencha o Profissional, Data, e Tipo da exceção.");
        return;
    }

    const payload = {
      doctor_id: profissional,
      date: dataAtendimento,
      start_time: inicio + ":00" || null, // Adiciona ":00" se o input type="time" retornar apenas HH:MM
      end_time: termino + ":00" || null,   // Adiciona ":00"
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
      const response = await fetch("https://mock.apidog.com/m1/1053378-0-default/rest/v1/doctor_exceptions", requestOptions);
      const result = await response.json();

      if (response.ok || response.status === 201) {
        console.log("Exceção de emergência criada com sucesso:", result);
        alert(`Consulta de emergência agendada como exceção! Detalhes: ${JSON.stringify(result)}`);
      } else {
        console.error("Erro ao criar exceção de emergência:", result);
        alert(`Erro ao agendar exceção. Status: ${response.status}. Detalhes: ${result.message || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("Erro na requisição para criar exceção:", error);
      alert("Erro de comunicação com o servidor ou formato de resposta inválido.");
    }
  };

  return (
    <div className="form-container">
      <form className="form-agendamento" onSubmit={handleSubmitExcecao}>
        <h2 className="section-title">Informações do médico</h2>

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
            <select name="tipoAtendimento" onChange={handleAtendimentoChange}>
              <option value="" disabled invisible selected>Selecione o tipo de exceção</option>
              <option value={dadosAtendimento.tipoAtendimento === "liberacao"} >Liberação</option>
              <option value={dadosAtendimento.tipoAtendimento === "bloqueio"} >Bloqueio</option>
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
                <label>Início</label>
                <input 
                  type="time" 
                  name="inicio" 
                  value={dadosAtendimento.inicio}
                  onChange={handleAtendimentoChange}
                />
              </div>

              <div className="campo-de-input">
                <label>Término</label>
                <input 
                  type="time" 
                  name="termino"  
                  value={dadosAtendimento.termino}
                  onChange={handleAtendimentoChange}
                />
              </div>
          
              <div className="campo-de-input">
                <label>Profissional solicitante</label>
                <select 
                  name="solicitante"
                  value={dadosAtendimento.solicitante}
                  onChange={handleAtendimentoChange}
                >
                  <option value="" disabled invisible selected>Selecione o solicitante</option>
                  <option value="secretaria">Secretária</option>
                  <option value="medico">Médico</option>
                </select>
              </div>
            </div>
          </section>

          <section className="informacoes-atendimento-segunda-linha-direita"> 

            <div className="campo-de-input">
              <label>Motivo da exceção</label>
              <textarea 
                name="motivo" 
                rows="4" 
                cols="1"
                value={dadosAtendimento.motivo}
                onChange={handleAtendimentoChange}
              ></textarea>
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

export default FormNovaDisponibilidade;