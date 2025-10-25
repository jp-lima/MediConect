import React from 'react';
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabelasemana.css";
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)

const TabelaAgendamentoSemana = ({ agendamentos, ListarDiasdoMes, setShowDeleteModal ,setSelectedId ,setDictInfo}) => {

  // Armazena o objeto COMPLETO das semanas organizadas
  const [semanasOrganizadas, setSemanasOrganizadas] = useState({});
  // Controla qual semana está sendo exibida (o índice da chave no objeto)
  const [Indice, setIndice] = useState(0); 

  const dataHoje = dayjs();
  const AnoAtual = dataHoje.year();
  const mes = dataHoje.month() + 1;

  let DiasdoMes = ListarDiasdoMes(AnoAtual, mes)
  
  // Array de chaves (ex: ['semana40', 'semana41', ...])
  const chavesDasSemanas = Object.keys(semanasOrganizadas);

  // Armazena o total de semanas que foram organizadas (para definir os limites de navegação)
  const totalSemanas = chavesDasSemanas.length; 

  // --- LÓGICA DE ORGANIZAÇÃO (useMemo mantido para otimização) ---

  const OrganizarAgendamentosSemanais = useMemo(() => {
    if (!agendamentos || Object.keys(agendamentos).length === 0) return {};

    const DiasComAtendimentos = Object.keys(agendamentos)
    const semanas = {}

    for (let i = 0; i < DiasComAtendimentos.length; i++) {
      const DiaComAtendimento = DiasComAtendimentos[i]
      const [_, MesDoAgendamento, DiaDoAgendamento] = DiaComAtendimento.split("-")

      const data = dayjs(`${AnoAtual}-${MesDoAgendamento}-${DiaDoAgendamento}`)
      const diaSemana = data.format('dddd') 
      const semanaKey = `semana${data.week()}`

      if (!semanas[semanaKey]) {
        semanas[semanaKey] = {
          segunda: [], terça: [], quarta: [], quinta: [], sexta: []
        }
      }

      switch (diaSemana) {
        case 'Monday':
          semanas[semanaKey].segunda.push(...agendamentos[DiaComAtendimento])
          break
        case 'Tuesday':
          semanas[semanaKey].terça.push(...agendamentos[DiaComAtendimento])
          break
        case 'Wednesday':
          semanas[semanaKey].quarta.push(...agendamentos[DiaComAtendimento])
          break
        case 'Thursday':
          semanas[semanaKey].quinta.push(...agendamentos[DiaComAtendimento])
          break
        case 'Friday':
          semanas[semanaKey].sexta.push(...agendamentos[DiaComAtendimento])
          break
        default:
          break
      }
    }

    return semanas
  }, [agendamentos, AnoAtual]) // Adicionei AnoAtual como dependência por segurança

  // --- EFEITO PARA POPULAR O ESTADO ---

  useEffect(() => {
    setSemanasOrganizadas(OrganizarAgendamentosSemanais);
    
    //console.log(semanasOrganizadas, `aqui`)
  }, [OrganizarAgendamentosSemanais])

  // --- NOVAS FUNÇÕES DE NAVEGAÇÃO ---

  const avancarSemana = () => {
    // Avança se o índice atual não for o último (totalSemanas - 1)
    if (Indice < totalSemanas - 1) {
      setIndice(Indice + 1);
    }
  };

  const voltarSemana = () => {
    // Volta se o índice atual não for o primeiro (0)
    if (Indice > 0) {
      setIndice(Indice - 1);
    }
  };
 
  
  // --- PREPARAÇÃO DOS DADOS PARA RENDERIZAÇÃO ---

  // Pega a chave da semana que deve ser exibida (usa o estado Indice)
  const chaveDaSemanaAtual = chavesDasSemanas[Indice];

  // Extrai os agendamentos da semana atual (ou um objeto vazio se não existir)
  const semanaParaRenderizar = semanasOrganizadas[chaveDaSemanaAtual] || {
    segunda: [], terça: [], quarta: [], quinta: [], sexta: []
  };

  // Determina o número máximo de linhas/consultas
  const numLinhas = Math.max(
    semanaParaRenderizar.segunda.length,
    semanaParaRenderizar.terça.length,
    semanaParaRenderizar.quarta.length,
    semanaParaRenderizar.quinta.length,
    semanaParaRenderizar.sexta.length
  );

  // Array de índices para iterar sobre as LINHAS da tabela
  const indicesDeLinha = Array.from({ length: numLinhas }, (_, i) => i);
  
  // Título da semana (para mostrar ao usuário)
  const tituloSemana = chaveDaSemanaAtual 
    ? `Semana ${chaveDaSemanaAtual.replace('semana', '')} / ${AnoAtual}` 
    : 'Nenhuma semana encontrada';

  // --- RENDERIZAÇÃO ---
  return (
    <div>
      {/* Container de Navegação */}
      <div id='tabela-seletor-container'>
        
        <button 
          onClick={voltarSemana} 
          disabled={Indice === 0} // Desabilita se for a primeira semana
        >
         <i className='bi bi-chevron-compact-left'></i>
        </button>
          <p>{tituloSemana}</p>
        <button 
          onClick={avancarSemana} 
          disabled={Indice === totalSemanas - 1 || totalSemanas === 0} // Desabilita se for a última semana ou se não houver semanas
        >
        <i className='bi bi-chevron-compact-right'></i> 
        </button>
      </div>

      {/* Tabela de Agendamentos */}
      <table className='tabelasemanal'>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Segunda</th>
            <th>Terça</th>
            <th>Quarta</th>
            <th>Quinta</th>
            <th>Sexta</th>
          </tr>
        </thead>
        <tbody>
          {indicesDeLinha.map((indiceLinha) => {

            let schedulet_at = semanaParaRenderizar.segunda[indiceLinha].scheduled_at.split("T")

            let horario = schedulet_at[1].split(":")

            console.log(horario)

            return(
            <tr key={indiceLinha}>
              {/* Célula para Horário (Pode ser ajustado para mostrar o horário real) */}
              <td>

               <p className='horario-texto'> {`${horario[0]}:${horario[1]}`} </p>
                  
              </td> 

              {/* Mapeamento de COLUNAS (dias) */}
              <td>
                {semanaParaRenderizar.segunda[indiceLinha] 
                  ? <CardConsulta DadosConsulta={semanaParaRenderizar.segunda[indiceLinha]} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo} />
                  : null
                }
              </td>
              <td>
                {semanaParaRenderizar.terça[indiceLinha]
                  ? <CardConsulta DadosConsulta={semanaParaRenderizar.terça[indiceLinha]} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo}/>
                  : null
                }
              </td>
              <td>
                {semanaParaRenderizar.quarta[indiceLinha]
                  ? <CardConsulta DadosConsulta={semanaParaRenderizar.quarta[indiceLinha]} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo}/>
                  : null
                }
              </td>
              <td>
                {semanaParaRenderizar.quinta[indiceLinha]
                  ? <CardConsulta DadosConsulta={semanaParaRenderizar.quinta[indiceLinha]} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo} />
                  : null
                }
              </td>
              <td>
                {semanaParaRenderizar.sexta[indiceLinha]
                  ? <CardConsulta DadosConsulta={semanaParaRenderizar.sexta[indiceLinha]}  setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo} />
                  : null
                }
              </td>
            </tr>
)})}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAgendamentoSemana;