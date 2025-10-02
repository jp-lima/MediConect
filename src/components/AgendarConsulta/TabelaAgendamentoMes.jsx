import React from 'react'
import AgendamentosMes from './DadosConsultasMock'
import dayjs from "dayjs"
import CardConsulta from './CardConsulta'
import "./style/styleTabelas/tabelames.css";

const TabelaAgendamentoMes = ({ListarDiasdoMes}) => {


  const dataHoje = dayjs()
  const AnoAtual = dataHoje.year()
  const mes = dataHoje.month() + 1

  let ListaDiasDatas = ListarDiasdoMes(AnoAtual, mes)

  let segundas = ListaDiasDatas[0];
  let tercas = ListaDiasDatas[1];
  let quartas = ListaDiasDatas[2];
  let quintas = ListaDiasDatas[3];
  let sextas = ListaDiasDatas[4]

  console.log(AnoAtual, 'ano', mes, 'mes')
  
  return (
    <div>
      <table className='tabelamensal'>
        <tr>
          <th>Seg</th>
          <th>Ter</th>
          <th>Qua</th>
          <th>Qui</th>
          <th>Sex</th>
        </tr>

        {Object.entries(AgendamentosMes).map(([semanas, dias], index) => (
          <tr key={index}>
            <td>
              <div>
                <p>{segundas[index]}</p>
                <div>
                  {dias.segunda.slice(0,4).map((consulta, idx) => (
                    <CardConsulta 
                      key={idx}
                      DadosConsulta={consulta} 
                      className={`usuario-${consulta.cor || "default"}`} 
                    />
                  ))}
                </div> 
                {dias.segunda.length > 3 ? 
                  <div><p className='cards-que-faltam'>+ {dias.segunda.length - 3}</p></div> 
                : null}
              </div>
            </td>
            
            <td>
              <div>
                {tercas[index]}
                <div>
                  {dias.terca.slice(0,4).map((consulta, idx) => (
                    <CardConsulta 
                      key={idx}
                      DadosConsulta={consulta} 
                      className={`usuario-${consulta.cor || "default"}`} 
                    />
                  ))}
                </div> 
                {dias.terca.length > 3 ? 
                  <div><p className='cards-que-faltam'>+ {dias.terca.length - 3}</p></div> 
                : null}
              </div>
            </td>

            <td>
              <div>
                {quartas[index]}
                <div>
                  {dias.quarta.slice(0,4).map((consulta, idx) => (
                    <CardConsulta 
                      key={idx}
                      DadosConsulta={consulta} 
                      className={`usuario-${consulta.cor || "default"}`} 
                    />
                  ))}
                </div> 
                {dias.quarta.length > 3 ? 
                  <div><p className='cards-que-faltam'>+ {dias.quarta.length - 3}</p></div> 
                : null}
              </div>
            </td>

            <td>
              <div>
                {quintas[index]}
                <div>
                  {dias.quinta.slice(0,4).map((consulta, idx) => (
                    <CardConsulta 
                      key={idx}
                      DadosConsulta={consulta} 
                      className={`usuario-${consulta.cor || "default"}`} 
                    />
                  ))}
                </div> 
                {dias.quinta.length > 3 ? 
                  <div><p className='cards-que-faltam'>+ {dias.quinta.length - 3}</p></div> 
                : null}
              </div>
            </td>

            <td>
              <div>
                {sextas[index]}
                <div>
                  {dias.sexta.slice(0,4).map((consulta, idx) => (
                    <CardConsulta 
                      key={idx}
                      DadosConsulta={consulta} 
                      className={`usuario-${consulta.cor || "default"}`} 
                    />
                  ))}
                </div> 
                {dias.sexta.length > 3 ? 
                  <div><p className='cards-que-faltam'>+ {dias.sexta.length - 3}</p></div> 
                : null}
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default TabelaAgendamentoMes
