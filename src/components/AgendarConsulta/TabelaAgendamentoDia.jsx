import React, { useState, useEffect } from 'react';
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabeladia.css";

const TabelaAgendamentoDia = ({ handleClickAgendamento, agendamentos, setShowDeleteModal, setDictInfo, setSelectedId }) => {
  const [indiceAcesso, setIndiceAcesso] = useState(0)
  const [Dia, setDia] = useState()
  const agendamentosDoDia = agendamentos?.semana1?.segunda || [];
  const nomeMedico = agendamentosDoDia.find(item => item.medico)?.medico || 'Profissional';

  let ListaDiasComAgendamentos = Object.keys(agendamentos)

  console.log(agendamentos)
  

  //console.log(Dia, "hshdhshhsdhs")

  useEffect(() => {
    setDia(ListaDiasComAgendamentos[indiceAcesso])
  }, [indiceAcesso])
  

  return (
    <div>
        <div>
          <div id='tabela-seletor-container'>
                <button onClick={() => {if(indiceAcesso === 0)return; else(setIndiceAcesso(indiceAcesso - 1))}}> <i className="bi bi-chevron-compact-left"></i></button>
                
                  
                  <p>{Dia ? `${Dia?.split('-')[2]}/${Dia?.split('-')[1]}/${Dia?.split('-')[0]}`: ''}</p>
                  
                <button onClick={() => {if(ListaDiasComAgendamentos.length - 1 === indiceAcesso)return; else(setIndiceAcesso(indiceAcesso + 1))}}>  <i className="bi bi-chevron-compact-right"></i></button>
              </div>
            </div>
      <table className='tabeladiaria'>
        <thead>
          <tr>
            <th className='cabecalho-horario'>Horário</th>
            <th>{}</th>
          </tr>
        </thead>

        <tbody>
          {agendamentos[Dia]?.map((agendamento, index) => {
            
            let Data =agendamento.scheduled_at.split("T")
            let horario = Data[1].split(':')
            return(
            <tr key={index}>
              
              <td className='coluna-horario'><p className='horario-texto'>{`${horario[0]}:${horario[1]}`}</p></td>
              <td className='mostrar-horario'>
                <div onClick={() => handleClickAgendamento(agendamento)}>
                  <CardConsulta DadosConsulta={agendamento} TabelaAgendamento={'dia'} setShowDeleteModal={setShowDeleteModal} setDictInfo={setDictInfo} setSelectedId={setSelectedId}/>
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAgendamentoDia;