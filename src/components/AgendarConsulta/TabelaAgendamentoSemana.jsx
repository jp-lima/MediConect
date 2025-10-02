import React from 'react'

import AgendamentosMes from './DadosConsultasMock'
import CardConsulta from './CardConsulta'
import "./style/styleTabelas/tabelasemana.css";

const TabelaAgendamentoSemana = () => {

  let AgendamentosDesseMes = AgendamentosMes

  let AgendamentoSemana = AgendamentosDesseMes.semana1


  let AgendamentosdeSegunda = AgendamentoSemana.segunda
  let AgendamentosdeTerca = AgendamentoSemana.terca
  let AgendamentosdeQuarta = AgendamentoSemana.quarta
  let AgendamentosdeQuinta = AgendamentoSemana.quinta
  let AgendamentosdeSexta = AgendamentoSemana.sexta


  return (
    <div >

    <table className='tabelasemanal'>
      <tr>
        <th></th>
        <th>Segunda</th>
        <th>Terça</th>
        <th>Quarta</th>
        <th>Quinta</th>
        <th>Sexta</th>
      </tr>


      {AgendamentosdeSegunda.map((consulta, index) => (

        <tr key={index}>
          <td>{consulta.horario}</td>
          <td className='coluna-tipo1'> <CardConsulta DadosConsulta={AgendamentosdeSegunda[index]} /> </td>
          <td> <CardConsulta DadosConsulta={AgendamentosdeTerca[index]} />   </td>
          <td> <CardConsulta DadosConsulta={AgendamentosdeQuarta[index]} /> </td>
          <td><CardConsulta DadosConsulta={AgendamentosdeQuinta[index]} /></td>
          <td><CardConsulta DadosConsulta={AgendamentosdeSexta[index]} /></td>
        </tr>
      ))}


    </table>

    </div>
  )
}

export default TabelaAgendamentoSemana