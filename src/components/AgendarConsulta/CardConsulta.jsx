import React from 'react'

const CardConsulta = ( {DadosConsulta, TabelaAgendamento} ) => {


  // Status (agendado, confirmado, realizado, cancelado)


  return (
    <div className={`container-cardconsulta-${TabelaAgendamento}`}>

      {DadosConsulta.status !== 'vazio'?
      <div className='cardconsulta' id={`status-card-consulta-${DadosConsulta.status}`}> 
      <section className='cardconsulta-infosecundaria'>
        <p>{DadosConsulta.horario}|GEAP| {DadosConsulta.medico}</p>
      </section>

      <section className='cardconsulta-infoprimaria'>
        <p>{DadosConsulta.paciente} - {DadosConsulta.motivo} - 23 anos</p>
      </section>
      </div>
      : 
     null
      
        }


    </div>
  )
}

export default CardConsulta