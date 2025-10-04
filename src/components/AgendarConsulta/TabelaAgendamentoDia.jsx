import React from 'react';
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabeladia.css";


const TabelaAgendamentoDia = ({ handleClickAgendamento, agendamentos }) => {
  const agendamentosDoDia = agendamentos?.semana1?.segunda || [];
  const nomeMedico = agendamentosDoDia.find(item => item.medico)?.medico || 'Profissional';

  return (
    <div>
      <table className='tabeladiaria'>
        <thead>
          <tr>
            <th>Horário</th>
            <th>{}</th>
          </tr>
        </thead>

        <tbody>
          {agendamentosDoDia.map((agendamento, index) => (
            <tr key={index}>
              <td><p>{agendamento.horario}</p></td>
              <td className='mostrar-horario'>
                <div onClick={() => handleClickAgendamento(agendamento)}>
                  <CardConsulta DadosConsulta={agendamento} TabelaAgendamento={'dia'} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAgendamentoDia;