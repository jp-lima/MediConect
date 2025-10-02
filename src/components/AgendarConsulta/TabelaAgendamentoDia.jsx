import React from 'react'
import CardConsulta from './CardConsulta'
import AgendamentosMes from './DadosConsultasMock'
import "./style/styleTabelas/tabeladia.css";

const TabelaAgendamentoDia = ({handleClickAgendamento}) => {

  let agendamentosDessaSemana = AgendamentosMes.semana1

  let agendamentos = agendamentosDessaSemana.segunda

  console.log(agendamentos)

  return (
   <div>
  <table className='tabeladiaria'>
    <thead>
      <tr>
        <th></th>
        <th>{agendamentos.medico}</th>
      </tr>
    </thead>

    <tbody>

    {agendamentos.map((agendamento) => (
      <tr key={agendamento.id} border='2' >
        <td ><p>{agendamento.horario}</p></td>
        <td className='mostrar-horario'>
          
          <div onClick={() => handleClickAgendamento(agendamento)} >
          <CardConsulta DadosConsulta={agendamento} TabelaAgendamento={'dia'} />
          </div>

        </td>
      </tr>

    ))}


    </tbody>
  </table>
</div>

  )
}

export default TabelaAgendamentoDia