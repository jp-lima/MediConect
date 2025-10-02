import React from "react";
import "./styleMedico/geral.css";

const pacientes = [
  {
    id: 1,
    nome: "Maria Oliveira",
    idade: 45,
    sexo: "Feminino",
    alergias: "Penicilina",
    historico: [
      { data: "2025-09-15", descricao: "Consulta de acompanhamento de hipertensão. Pressão arterial controlada." },
      { data: "2025-07-20", descricao: "Relatou dores de cabeça frequentes." },
    ],
    medicamentos: [
      { nome: "Losartana 50mg", uso: "1x ao dia pela manhã" },
      { nome: "Dipirona 500mg", uso: "Em caso de dor" },
    ],
  },
  {
    id: 2,
    nome: "Carlos Souza",
    idade: 62,
    sexo: "Masculino",
    alergias: "Nenhuma conhecida",
    historico: [
      { data: "2025-09-01", descricao: "Check-up anual. Glicemia de jejum elevada." },
      { data: "2025-03-12", descricao: "Queixa de dor no joelho direito após esforço." },
    ],
    medicamentos: [
      { nome: "Metformina 850mg", uso: "2x ao dia, após as refeições" },
    ],
  },
  {
    id: 3,
    nome: "Ana Costa",
    idade: 28,
    sexo: "Feminino",
    alergias: "Pólen e poeira",
    historico: [
      { data: "2025-08-22", descricao: "Crise de rinite alérgica. Prescrito novo anti-histamínico." },
      { data: "2025-01-30", descricao: "Consulta de rotina ginecológica." },
    ],
    medicamentos: [
      { nome: "Loratadina 10mg", uso: "1x ao dia durante crises alérgicas" },
    ],
  },
  {
    id: 4,
    nome: "João da Silva",
    idade: 35,
    sexo: "Masculino",
    alergias: "Nenhuma conhecida",
    historico: [
      { data: "2025-09-10", descricao: "Consulta de rotina – tudo normal" },
      { data: "2025-08-05", descricao: "Exame de sangue – colesterol levemente alto" },
    ],
    medicamentos: [
      { nome: "Atorvastatina 10mg", uso: "1x ao dia" },
    ],
  },
  {
    id: 5,
    nome: "Pedro Rocha",
    idade: 55,
    sexo: "Masculino",
    alergias: "Frutos do mar",
    historico: [
      { data: "2025-09-18", descricao: "Relatou dor e inchaço no tornozelo esquerdo." },
      { data: "2025-04-11", descricao: "Exames de rotina, sem alterações significativas." },
    ],
    medicamentos: [
      { nome: "Nimesulida 100mg", uso: "2x ao dia por 5 dias" },
    ],
  },
];

function Prontuario() {
  return (
    <>
      {pacientes.map((paciente) => (
        <div key={paciente.id} className="prontuario-container">
          <h1>Prontuário Médico de {paciente.nome}</h1>

          {/* ---- Agrupe as seções em um container flex ---- */}
          <div className="prontuario-sections">
            <section className="prontuario-section">
              <h2>Dados do Paciente</h2>
              <p><strong>Nome:</strong> {paciente.nome}</p>
              <p><strong>Idade:</strong> {paciente.idade}</p>
              <p><strong>Sexo:</strong> {paciente.sexo}</p>
              <p><strong>Alergias:</strong> {paciente.alergias}</p>
            </section>

            <section className="prontuario-section">
              <h2>Histórico de Consultas</h2>
              <ul>
                {paciente.historico.map((item, i) => (
                  <li key={i}>
                    <strong>{item.data}:</strong> {item.descricao}
                  </li>
                ))}
              </ul>
            </section>

            <section className="prontuario-section">
              <h2>Medicamentos em Uso</h2>
              <ul>
                {paciente.medicamentos.map((med, i) => (
                  <li key={i}>
                    <strong>{med.nome}</strong> – {med.uso}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ))}
    </>
  );
}

export default Prontuario;
