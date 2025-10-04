import React from 'react';
 
import dayjs from "dayjs";
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabelames.css";


const TabelaAgendamentoMes = ({ ListarDiasdoMes, agendamentos }) => {

  const dataHoje = dayjs();
  const AnoAtual = dataHoje.year();
  const mes = dataHoje.month() + 1;

  let ListaDiasDatas = ListarDiasdoMes(AnoAtual, mes);

  let segundas = ListaDiasDatas[0];
  let tercas = ListaDiasDatas[1];
  let quartas = ListaDiasDatas[2];
  let quintas = ListaDiasDatas[3];
  let sextas = ListaDiasDatas[4];

  return (
    <div>
      <table className='tabelamensal'>
        <thead>
          <tr>
            <th>Seg</th>
            <th>Ter</th>
            <th>Qua</th>
            <th>Qui</th>
            <th>Sex</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos && Object.entries(agendamentos).map(([semana, dias], index) => (
            <tr key={index}>
              {/* Coluna de Segunda-feira */}
              <td>
                <div>
                  <p>{segundas[index]}</p>
                  <div>
                    {(dias.segunda || []).slice(0, 3).map((consulta, idx) => (
                      <CardConsulta
                        key={idx}
                        DadosConsulta={consulta}
                        className={`usuario-${consulta.cor || "default"}`}
                      />
                    ))}
                  </div>
                  {(dias.segunda || []).length > 3 ?
                    <div><p className='cards-que-faltam'>+ {(dias.segunda || []).length - 3}</p></div>
                    : null}
                </div>
              </td>

              {/* Coluna de Terça-feira */}
              <td>
                <div>
                  <p>{tercas[index]}</p>
                  <div>
                    {(dias.terca || []).slice(0, 3).map((consulta, idx) => (
                      <CardConsulta
                        key={idx}
                        DadosConsulta={consulta}
                        className={`usuario-${consulta.cor || "default"}`}
                      />
                    ))}
                  </div>
                  {(dias.terca || []).length > 3 ?
                    <div><p className='cards-que-faltam'>+ {(dias.terca || []).length - 3}</p></div>
                    : null}
                </div>
              </td>

              {/* Coluna de Quarta-feira */}
              <td>
                <div>
                  <p>{quartas[index]}</p>
                  <div>
                    {(dias.quarta || []).slice(0, 3).map((consulta, idx) => (
                      <CardConsulta
                        key={idx}
                        DadosConsulta={consulta}
                        className={`usuario-${consulta.cor || "default"}`}
                      />
                    ))}
                  </div>
                  {(dias.quarta || []).length > 3 ?
                    <div><p className='cards-que-faltam'>+ {(dias.quarta || []).length - 3}</p></div>
                    : null}
                </div>
              </td>

              {/* Coluna de Quinta-feira */}
              <td>
                <div>
                  <p>{quintas[index]}</p>
                  <div>
                    {(dias.quinta || []).slice(0, 3).map((consulta, idx) => (
                      <CardConsulta
                        key={idx}
                        DadosConsulta={consulta}
                        className={`usuario-${consulta.cor || "default"}`}
                      />
                    ))}
                  </div>
                  {(dias.quinta || []).length > 3 ?
                    <div><p className='cards-que-faltam'>+ {(dias.quinta || []).length - 3}</p></div>
                    : null}
                </div>
              </td>

              {/* Coluna de Sexta-feira */}
              <td>
                <div>
                  <p>{sextas[index]}</p>
                  <div>
                    {(dias.sexta || []).slice(0, 3).map((consulta, idx) => (
                      <CardConsulta
                        key={idx}
                        DadosConsulta={consulta}
                        className={`usuario-${consulta.cor || "default"}`}
                      />
                    ))}
                  </div>
                  {(dias.sexta || []).length > 3 ?
                    <div><p className='cards-que-faltam'>+ {(dias.sexta || []).length - 3}</p></div>
                    : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TabelaAgendamentoMes;