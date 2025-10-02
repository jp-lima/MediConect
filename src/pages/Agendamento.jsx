import React, { useState } from 'react'

import TabelaAgendamentoDia from '../components/AgendarConsulta/TabelaAgendamentoDia';
import TabelaAgendamentoSemana from '../components/AgendarConsulta/TabelaAgendamentoSemana';
import TabelaAgendamentoMes from '../components/AgendarConsulta/TabelaAgendamentoMes';
import FormNovaConsulta from '../components/AgendarConsulta/FormNovaConsulta';

import dayjs from 'dayjs'
import "./style/Agendamento.css";
import './style/FilaEspera.css';

const Agendamento = () => {

  const [FiladeEspera, setFiladeEspera] = useState(false)
  const [tabela, setTabela] = useState('diario')
  const [PageNovaConsulta, setPageConsulta] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') // 🔹 Estado da busca

  // 🔹 Dados da fila de espera
  const filaEsperaData = [
    { nome: 'Ricardo Pereira', email: 'ricardo.pereira@gmail.com', cpf: '444.777.666-55', telefone: '(79) 99123-4567', entrada: '25/09/2025 às 08:00' },
    { nome: 'Ana Costa', email: 'ana.costa@gmail.com', cpf: '321.654.987-00', telefone: '(79) 97777-3333', entrada: '25/09/2025 às 08:30' },
    { nome: 'Lucas Martins', email: 'lucas.martins@gmail.com', cpf: '777.666.555-33', telefone: '(79) 99654-3210', entrada: '25/09/2025 às 09:00' },
    { nome: 'João Souza', email: 'joao.souza@gmail.com', cpf: '987.654.321-00', telefone: '(79) 98888-2222', entrada: '25/09/2025 às 14:00' },
    { nome: 'Maria Silva', email: 'maria.silva@gmail.com', cpf: '123.456.789-00', telefone: '(79) 99999-1111', entrada: '25/09/2025 às 14:30' },
    { nome: 'Fernanda Lima', email: 'fernanda.lima@gmail.com', cpf: '888.999.000-22', telefone: '(79) 98877-6655', entrada: '26/09/2025 às 09:30' },
    { nome: 'Carlos Andrade', email: 'carlos.andrade@gmail.com', cpf: '222.555.888-11', telefone: '(79) 99876-5432', entrada: '26/09/2025 às 10:00' },
    { nome: 'Juliana Oliveira', email: 'juliana.o@gmail.com', cpf: '111.222.333-44', telefone: '(79) 98765-1234', entrada: '26/09/2025 às 11:30' },
  ];

  // 🔹 Filtra a fila de espera com base no searchTerm
  const filteredFila = filaEsperaData.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cpf.includes(searchTerm) ||
    item.telefone.includes(searchTerm)
  );

  const ListarDiasdoMes = (ano, mes) => {
    let segundas = []; let tercas = []; let quartas = []; let quintas = []; let sextas = []

    const base = dayjs(`${ano}-${mes}-01`)
    const DiasnoMes = base.daysInMonth()

    for (let d = 1; d <= DiasnoMes; d++) {
      const data = dayjs(`${ano}-${mes}-${d}`)
      const dia = data.format('dddd')

      switch (dia) {
        case 'Monday': segundas.push(d); break
        case 'Tuesday': tercas.push(d); break
        case 'Wednesday': quartas.push(d); break
        case 'Thursday': quintas.push(d); break
        case 'Friday': sextas.push(d); break
        default: break
      }
    }

    let ListaDiasDatas = [segundas, tercas, quartas, quintas, sextas]
    return ListaDiasDatas
  }

  const handleClickAgendamento = (agendamento) => {
    if (agendamento.status !== 'vazio') return
    else setPageConsulta(true)
  }

  const handleClickCancel = () => setPageConsulta(false)

  return (
    <div>
      <h1>Agendar nova consulta</h1>

      {!PageNovaConsulta ? (

        <div className='atendimento-eprocura'>

          {/* 🔍 Busca e filtro */}
          <div className='busca-atendimento'>
            <div>
              <i className="fa-solid fa-calendar-day"></i>
              <input type="text" placeholder="Buscar atendimento" />
            </div>

            <div>
              <select>
                <option value="" disabled selected>Agendar</option>
                <option value="">Atendimento</option>
                <option value="">Sessões</option>
                <option value="">Urgência</option>
              </select>
            </div>
          </div>

          {/* 🏥 Unidade e profissional */}
          <div className='unidade-selecionarprofissional'>
            <select>
              <option value="" disabled selected >Unidade</option>
              <option value="">Unidade Central</option>
              <option value="">Unidade Zona Norte</option>
              <option value="">Unidade Zona Oeste</option>
            </select>

            <input type="text" placeholder='Selecionar profissional' />
          </div>

          {/* Botões para alternar Agenda / Fila de Espera */}
          <div className='container-btns-agenda-fila_esepera'>
            <button
              className={`btn-agenda ${FiladeEspera === false ? "opc-agenda-ativo" : ""}`}
              onClick={() => setFiladeEspera(false)}
            >
              Agenda
            </button>

            <button
              className={`btn-fila-espera ${FiladeEspera === true ? "opc-filaespera-ativo" : ""}`}
              onClick={() => setFiladeEspera(true)}
            >
              Fila de espera
            </button>
          </div>

          <section className='calendario-ou-filaespera'>
            {FiladeEspera === false ?
              (
                <div className='calendario'>
                  <div>
                    <section className='btns-e-legenda-container'>
                      <div>
                        <button
                          className={`btn-selecionar-tabeladia ${tabela === "diario" ? "ativo" : ""}`}
                          onClick={() => setTabela("diario")}
                        >
                          <i className="fa-solid fa-calendar-day"></i>
                          Dia
                        </button>

                        <button
                          className={`btn-selecionar-tabelasemana ${tabela === 'semanal' ? 'ativo' : ""}`}
                          onClick={() => setTabela("semanal")}
                        >
                          <i className="fa-solid fa-calendar-day"></i>
                          Semana
                        </button>

                        <button
                          className={`btn-selecionar-tabelames ${tabela === 'mensal' ? 'ativo' : ''}`}
                          onClick={() => setTabela("mensal")}
                        >
                          <i className="fa-solid fa-calendar-day"></i>
                          Mês
                        </button>
                      </div>

                      <div className='legenda-tabela'>
                        <div className='legenda-item-realizado'><span>Realizado</span></div>
                        <div className='legenda-item-confirmado'><span>Confirmado</span></div>
                        <div className='legenda-item-agendado'><span>Agendado</span></div>
                        <div className='legenda-item-cancelado'><span>Cancelado</span></div>
                      </div>

                    </section>

                    {tabela === "diario" && <TabelaAgendamentoDia handleClickAgendamento={handleClickAgendamento} />}
                    {tabela === 'semanal' && <TabelaAgendamentoSemana />}
                    {tabela === 'mensal' && <TabelaAgendamentoMes ListarDiasdoMes={ListarDiasdoMes} aplicarCores={true} />}
                  </div>
                </div>
              )
              :
              (
                <div className="fila-container">
                <div className="fila-header">
  <input
    type="text"
    placeholder="Pesquisar..."
    className="busca-fila-espera"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <h2 className="fila-titulo">Fila de Espera</h2>
</div>



                  <table className="fila-tabela">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Entrou na fila de espera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFila.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nome}</td>
                          <td>{item.email}</td>
                          <td>{item.cpf}</td>
                          <td>{item.telefone}</td>
                          <td>{item.entrada}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </section>
        </div>

      ) : (
        <FormNovaConsulta onCancel={handleClickCancel} />
      )}
    </div>
  )
}

export default Agendamento