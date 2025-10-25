import React from 'react';
 
import dayjs from "dayjs";
import CardConsulta from './CardConsulta';
import "./style/styleTabelas/tabelames.css";
import { useEffect, useState } from 'react';
import { useMemo } from 'react';

const TabelaAgendamentoMes = ({ ListarDiasdoMes, agendamentos, setShowDeleteModal, setSelectedId ,setDictInfo }) => {

  const dataHoje = dayjs();
  const AnoAtual = dataHoje.year();
  const mes = dataHoje.month() + 1;

  let ListaDiasDatas = ListarDiasdoMes(AnoAtual, mes);
  const [AgendamentosSemanaisOrganizados, setAgendamentosSemanaisOrganizados] = useState({})
  const [indice, setIndice] = useState("10")

  const [AgendamentosMensaisOrganizados, setAgendamentosMensaisOrganizados] = useState({
  "01": { "nomeDoMes": "janeiro" },
  "02": { "nomeDoMes": "fevereiro" },
  "03": { "nomeDoMes": "março" },
  "04": { "nomeDoMes": "abril" },
  "05": { "nomeDoMes": "maio" },
  "06": { "nomeDoMes": "junho" },
  "07": { "nomeDoMes": "julho" },
  "08": { "nomeDoMes": "agosto" },
  "09": { "nomeDoMes": "setembro" },
  "10": { "nomeDoMes": "outubro" },
  "11": { "nomeDoMes": "novembro" },
  "12": { "nomeDoMes": "dezembro" }
})


  

   const OrganizarAgendamentosSemanais = useMemo(() => {
      if (!agendamentos || Object.keys(agendamentos).length === 0) return {};
  
      const DiasComAtendimentos = Object.keys(agendamentos)
      const semanas = {}

  
      for (let i = 0; i < DiasComAtendimentos.length; i++) {
        const DiaComAtendimento = DiasComAtendimentos[i]
        const [_, MesDoAgendamento, DiaDoAgendamento] = DiaComAtendimento.split("-")
  
        const data = dayjs(`${AnoAtual}-${MesDoAgendamento}-${DiaDoAgendamento}`)
        const diaSemana = data.format('dddd') 
        const semanaKey = `semana${data.week()}`
  
        if (!semanas[semanaKey]) {
          semanas[semanaKey] = {
            segunda: [], terça: [], quarta: [], quinta: [], sexta: []
          }
        }
  
        switch (diaSemana) {
          case 'Monday':
            semanas[semanaKey].segunda.push(...agendamentos[DiaComAtendimento])
            break
          case 'Tuesday':
            semanas[semanaKey].terça.push(...agendamentos[DiaComAtendimento])
            break
          case 'Wednesday':
            semanas[semanaKey].quarta.push(...agendamentos[DiaComAtendimento])
            break
          case 'Thursday':
            semanas[semanaKey].quinta.push(...agendamentos[DiaComAtendimento])
            break
          case 'Friday':
            semanas[semanaKey].sexta.push(...agendamentos[DiaComAtendimento])
            break
          default:
            break
        }
      }
  
      return semanas
    }, [agendamentos, AnoAtual])

     useEffect(() => {
       setAgendamentosSemanaisOrganizados(OrganizarAgendamentosSemanais);
      

        // NOTA: Ao carregar, o Indice é 0, que é a primeira semana.
      }, [OrganizarAgendamentosSemanais])

      useEffect(() => {
        console.log(OrganizarAgendamentosMensais)
      }, [])

      useEffect(() => {
        console.log(AgendamentosMensaisOrganizados, 'aqui os agendamentos mensais')
      }, [AgendamentosMensaisOrganizados])

      const OrganizarAgendamentosMensais = useMemo(() => {
  if (!AgendamentosSemanaisOrganizados || Object.keys(AgendamentosSemanaisOrganizados).length === 0)
    return;

  // Cria uma cópia local do estado atual
  const novoEstado = { ...AgendamentosMensaisOrganizados };

  const indices = Object.keys(AgendamentosSemanaisOrganizados);

  for (let i = 0; i < indices.length; i++) {
    const DictSemanais = AgendamentosSemanaisOrganizados[indices[i]];
    const indicesDictSemanais = Object.keys(DictSemanais);

    for (let d = 0; d < indicesDictSemanais.length; d++) {
      const lista = DictSemanais[indicesDictSemanais[d]];

      if (lista.length > 0) {
        const [_, mesDaConsulta] = lista[0].scheduled_at.split("-");
        
        // Cria o mês se ainda não existir
        if (!novoEstado[mesDaConsulta]) {
          novoEstado[mesDaConsulta] = {
            nomeDoMes: AgendamentosMensaisOrganizados[mesDaConsulta]?.nomeDoMes || "",
          };
        }

        // Garante que a semana existe
        novoEstado[mesDaConsulta][indices[i]] = {
          ...novoEstado[mesDaConsulta][indices[i]],
          ...DictSemanais,
        };
      }
    }
  }

  // Faz o set de uma vez só
  setAgendamentosMensaisOrganizados(novoEstado);
}, [AgendamentosSemanaisOrganizados]);

      const AvançarMes = () => {
   let Indice = parseInt(indice)
        Indice += 1        

        console.log(Indice)
        if(Indice < 10){
          Indice = "0" + Indice.toString()
          console.log(Indice)
        }
        if(Indice === 13){
          return
        }else{ 
        setIndice(Indice)
        }
      }

      const VoltarMes = () => {
        let Indice = parseInt(indice)
        
        Indice -= 1

        console.log(Indice)
        if(Indice < 10){
          Indice = "0" + Indice.toString()
          console.log(Indice)
        }
        if(Indice === "00"){
          return
        }else{
          
        setIndice(Indice)
        }


      }
  

  return (
    <div>
      <div >
          <div id='tabela-seletor-container'>
          <button onClick={() => VoltarMes()}><i className="bi bi-chevron-compact-left"></i></button>
            <p>{AgendamentosMensaisOrganizados[indice].nomeDoMes}</p>
          
          <button onClick={() => AvançarMes()}> <i className="bi bi-chevron-compact-right"></i> </button>
        </div>
      </div>
      <table className='tabelamensal'>
       <thead>
          <tr>
            <th className='cabecalho-tabela'>Segunda</th>
            <th>Terça</th>
            <th>Quarta</th>
            <th>Quinta</th>
            <th>Sexta</th>
          </tr>
        </thead>
        <tbody>
            {Object.keys(AgendamentosMensaisOrganizados[indice]).map((semanaKey) => {
              const semana = AgendamentosMensaisOrganizados[indice][semanaKey]
              console.log(AgendamentosMensaisOrganizados[indice][semanaKey], 'ajdsahchbaohdfoduh')


              return(
               <tr key={semanaKey}>
     
      {
        semana && typeof semana === "object" && Object.keys(semana).map((dia) => (
          <td key={dia} >
            <CardConsulta DadosConsulta={((semana[dia]|| [])[0]) || {status:'vazio'}} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo}/>
            <CardConsulta DadosConsulta={((semana[dia]|| [])[1]) || {status:'vazio'}} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo}/>
            <CardConsulta DadosConsulta={((semana[dia]|| [])[2]) || {status:'vazio'}} setShowDeleteModal={setShowDeleteModal} setSelectedId={setSelectedId} setDictInfo={setDictInfo}/>
            {semana[dia].length > 3 ? (
              <div>
                <p>{` +${semana[dia].length - 2}`}</p>
              </div>

            ): null }
          </td>
        ))
      }
    </tr>

              )})}
            </tbody>
      </table>
    </div>
  )
}

export default TabelaAgendamentoMes;