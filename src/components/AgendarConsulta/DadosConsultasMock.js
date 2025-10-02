
  // Status (agendado, confirmado, realizado, cancelado)


let AgendamentosMes = {semana1:{
    segunda:[   { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio' },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    terca:[   { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    quarta:[  { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    quinta:[  { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    sexta:[  { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }]


}, semana2:{segunda:[     { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    terca:[   { horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' },
    { horario: '07:10', status:'vazio' },
    { horario: '07:20', medico: 'Rogerio Cena', paciente: 'Ana Paula', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '07:30', medico: 'Rogerio Cena', paciente: 'Bruno Lima', status: 'realizado', motivo:'Consulta de Rotina' },
    { horario: '07:40', status:'vazio'  },
    { horario: '07:50', medico: 'Rogerio Cena', paciente: 'Felipe Duarte', status: 'cancelado', motivo:'Consulta de Rotina' },
    { horario: '08:00', medico: 'Rogerio Cena', paciente: 'Carolina Alves', status: 'confirmado', motivo:'2 Exames' },
    { horario: '08:10', medico: 'Rogerio Cena', paciente: 'Ricardo Gomes', status: 'agendado', motivo:'retorno' },
    { horario: '08:20', medico: 'Rogerio Cena', paciente: 'Tatiane Ramos', status: 'confirmado', motivo: '' },
    { horario: '08:30', medico: 'Rogerio Cena', paciente: 'Daniel Oliveira', status: 'realizado', motivo: '' }],

    quarta:[{ horario: '07:10', status:'vazio' }],

    quinta:[{ horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' }],

    sexta:[{ horario: '07:00', medico: 'Rogerio Cena', paciente: 'Caio Miguel', status: 'confirmado', motivo:'Consulta de Rotina' }]}




}


export default AgendamentosMes