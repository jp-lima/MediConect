import React from 'react';
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabelasemana.css";


const TabelaAgendamentoSemana = ({ agendamentos }) => {

 
  const agendamentoSemana = agendamentos?.semana1 || {};

  
  const agendamentosDeSegunda = agendamentoSemana.segunda || [];
  const agendamentosDeTerca = agendamentoSemana.terca || [];
  const agendamentosDeQuarta = agendamentoSemana.quarta || [];
  const agendamentosDeQuinta = agendamentoSemana.quinta || [];
  const agendamentosDeSexta = agendamentoSemana.sexta || [];

  
  const numLinhas = Math.max(
    agendamentosDeSegunda.length,
    agendamentosDeTerca.length,
    agendamentosDeQuarta.length,
    agendamentosDeQuinta.length,
    agendamentosDeSexta.length
  );

  return (
    <div>
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
          {Array.from({ length: numLinhas }).map((_, index) => {
            
            const consultaSeg = agendamentosDeSegunda[index];
            const consultaTer = agendamentosDeTerca[index];
            const consultaQua = agendamentosDeQuarta[index];
            const consultaQui = agendamentosDeQuinta[index];
            const consultaSex = agendamentosDeSexta[index];

            
            const horarioDaLinha = consultaSeg?.horario || consultaTer?.horario || consultaQua?.horario || consultaQui?.horario || consultaSex?.horario;

            return (
              <tr key={index}>
                <td>{horarioDaLinha}</td>
                <td>{consultaSeg && <CardConsulta DadosConsulta={consultaSeg} />}</td>
                <td>{consultaTer && <CardConsulta DadosConsulta={consultaTer} />}</td>
                <td>{consultaQua && <CardConsulta DadosConsulta={consultaQua} />}</td>
                <td>{consultaQui && <CardConsulta DadosConsulta={consultaQui} />}</td>
                <td>{consultaSex && <CardConsulta DadosConsulta={consultaSex} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAgendamentoSemana;