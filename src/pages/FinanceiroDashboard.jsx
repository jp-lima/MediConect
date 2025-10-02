import React, { useState, useEffect, useMemo, useCallback } from "react";
import './style/FinanceiroDashboard.css';

const CONVENIOS_LIST = [
  "Particular",
  "Amil",
  "Bradesco Saúde",
  "SulAmérica",
  "Unimed",
  "Cassio",
  "Outro"
];

function CurrencyInput({ value, onChange, label, id }) {
  const formattedValue = useMemo(() => {
    let numericValue = Number(value) || 0;
    
    let stringValue = String(numericValue);
    while (stringValue.length < 3) {
      stringValue = '0' + stringValue;
    }

    const integerPart = stringValue.slice(0, -2);
    const decimalPart = stringValue.slice(-2);
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${formattedInteger},${decimalPart}`;
  }, [value]);

  const handleKeyDown = useCallback((e) => {
    const key = e.key;

    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)) {
      if (key === 'Backspace' || key === 'Delete') {
          e.preventDefault();
          const numericValue = value || 0;
          let newValueString = String(numericValue);
          if (newValueString.length <= 1) {
              onChange(0);
          } else {
              const newNumericValue = parseInt(newValueString.slice(0, -1)) || 0;
              onChange(newNumericValue);
          }
      }
      return;
    }

    if (!/^\d$/.test(key)) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    
    const digit = key;
    const numericValue = value || 0;

    let newValueString = String(numericValue) + digit;
    
    if (newValueString.length > 10) return; 

    const newNumericValue = parseInt(newValueString);

    onChange(newNumericValue);
  }, [value, onChange]);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input 
        id={id}
        className="input-field currency-input" 
        type="text" 
        value={formattedValue} 
        onChange={() => {}} 
        onKeyDown={handleKeyDown}
        placeholder="R$ 0,00"
      />
    </div>
  );
}

function mockFetchPagamentos() {
  return [
    {
      id: "PAY-001",
      paciente: { nome: "Sarah Oliveira", convenio: "Unimed" },
      valor: 20000, 
      forma_pagamento: "Cartão",
      data_vencimento: "2025-09-30",
      status: "pendente",
      desconto: 0,
      observacoes: "Pagamento parcelado em 2x"
    },
    {
      id: "PAY-002",
      paciente: { nome: "Laissa Marquetti", convenio: "Bradesco Saúde" },
      valor: 15000,
      forma_pagamento: "Dinheiro",
      data_vencimento: "2025-09-15",
      status: "pago",
      desconto: 1000, 
      observacoes: ""
    },
    {
      id: "PAY-003",
      paciente: { nome: "Vera Santos", convenio: "Particular" },
      valor: 30000,
      forma_pagamento: "Pix",
      data_vencimento: "2025-09-20",
      status: "vencido",
      desconto: 0,
      observacoes: "Não respondeu ao contato"
    },
      {
      id: "PAY-004",
      paciente: { nome: "Carlos Almeida", convenio: "Particular" },
      valor: 10000,
      forma_pagamento: "Transferência",
      data_vencimento: "2025-09-29",
      status: "pago",
      desconto: 500, 
      observacoes: "Desconto por pagamento adiantado"
    }
  ];
}

export default function FinanceiroDashboard() {
  const [pagamentos, setPagamentos] = useState([]);
  const [modalPagamento, setModalPagamento] = useState(null);
  const [query, setQuery] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [novoPagamento, setNovoPagamento] = useState(false);
  const [summary, setSummary] = useState({ totalRecebido: 0, totalAReceber: 0, totalDescontos: 0 });

  useEffect(() => {
    const data = mockFetchPagamentos();
    setPagamentos(data);
  }, []);

  function formatCurrency(centavos) {
    const valorEmReais = centavos / 100;
    return "R$ " + valorEmReais.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function getValorLiquido(valor, desconto) {
    return valor - desconto;
  }

  const filteredPagamentos = useMemo(() => {
    return pagamentos.filter(p => {
      const q = query.toLowerCase();
      const statusOk = filtroStatus === "Todos" || p.status === filtroStatus;
      const buscaOk = p.paciente.nome.toLowerCase().includes(q) || 
                      p.id.toLowerCase().includes(q); 
      return statusOk && buscaOk;
    });
  }, [pagamentos, query, filtroStatus]);

  useEffect(() => {
    let recebido = 0;
    let aReceber = 0;
    let descontos = 0;

    filteredPagamentos.forEach(p => {
      const valorLiquido = getValorLiquido(p.valor, p.desconto);
      if (p.status === 'pago') {
        recebido += valorLiquido;
        descontos += p.desconto;
      } else {
        aReceber += p.valor; 
      }
    });

    setSummary({
      totalRecebido: recebido,
      totalAReceber: aReceber,
      totalDescontos: descontos
    });
  }, [filteredPagamentos]);

  function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja excluir este pagamento?")) {
      setPagamentos(prev => prev.filter(p => p.id !== id));
      setModalPagamento(null);
    }
  }

  function handleSave(pagamento) {
    if (!pagamento.paciente.nome || !pagamento.valor || !pagamento.data_vencimento || !pagamento.paciente.convenio) {
        alert("Preencha Paciente, Convênio, Valor e Data de Vencimento.");
        return;
    }

    if (novoPagamento) {
      const newId = "PAY-" + (pagamentos.length + 1).toString().padStart(3, "0");
      pagamento.id = newId; 
      setPagamentos(prev => [...prev, pagamento]);
    } else {
      setPagamentos(prev => prev.map(p => p.id === pagamento.id ? pagamento : p));
    }
    setModalPagamento(null);
    setNovoPagamento(false);
  }
  
  const closeModal = () => {
    setModalPagamento(null);
    setNovoPagamento(false);
  };

  return (
    <div className="financeiro-wrap">
      <h2>Controle Financeiro</h2>
      
      <div className="summary-card-container">
        <div className="summary-card green">
            <h3>Total Recebido (Filtrado)</h3>
            <p className="value">{formatCurrency(summary.totalRecebido)}</p>
        </div>
        <div className="summary-card red">
            <h3>Total a Receber (Filtrado)</h3>
            <p className="value">{formatCurrency(summary.totalAReceber)}</p>
        </div>
        <div className="summary-card blue">
            <h3>Descontos Aplicados</h3>
            <p className="value">{formatCurrency(summary.totalDescontos)}</p>
        </div>
      </div>

      <div className="list-page-card"> 
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          <input 
            className="input-field"
            placeholder="Buscar paciente" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            style={{ flexGrow: 1 }}
          />
          <select className="select-field" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="vencido">Vencido</option>
          </select>
          <button 
            className="action-btn" 
            style={{ background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" }}
            onClick={() => { 
              setModalPagamento({
                paciente: { nome:"", convenio: CONVENIOS_LIST[0] }, 
                valor:0, 
                forma_pagamento:"Dinheiro",
                data_vencimento: new Date().toISOString().split('T')[0],
                status:"pendente",
                desconto:0, 
                observacoes:""
              }); 
              setNovoPagamento(true); 
            }}
          >
            + Adicionar Pagamento
          </button>
        </div>

        {filteredPagamentos.length === 0 ? (
          <div className="empty">Nenhum pagamento encontrado.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr> 
                  <th>Paciente</th>
                  <th>Convênio</th>
                  <th>Valor Total (R$)</th>
                  <th>Desconto (R$)</th>
                  <th>Valor Líquido (R$)</th> 
                  <th>Forma</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPagamentos.map(p => (
                  <tr key={p.id}>
                    <td>{p.paciente.nome}</td>
                    <td>{p.paciente.convenio}</td>
                    <td>{formatCurrency(p.valor)}</td>
                    <td>{formatCurrency(p.desconto)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(getValorLiquido(p.valor, p.desconto))}</td>
                    <td>{p.forma_pagamento}</td>
                    <td>{p.data_vencimento.split('-').reverse().join('/')}</td>
                    <td><span className={`badge ${p.status}`}>{p.status.toUpperCase()}</span></td>
                    <td>
                      <div className="action-group"> 
                        <button 
                          className="action-btn" 
                          onClick={() => { setModalPagamento({...p}); setNovoPagamento(false); }}
                        >
                          Ver / Editar
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDelete(p.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalPagamento && (
        <div className="modal" onClick={(e) => e.target.classList.contains('modal') && closeModal()}>
          <div className="modal-card">
            <div className="modal-header">
              <h2>{novoPagamento ? "Adicionar Pagamento" : `Editar Pagamento - ${modalPagamento.paciente.nome}`}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="paciente_nome">Paciente</label>
                <input 
                  id="paciente_nome"
                  className="input-field" 
                  value={modalPagamento.paciente.nome} 
                  onChange={e => setModalPagamento({...modalPagamento, paciente:{...modalPagamento.paciente, nome:e.target.value}})} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="convenio">Convênio</label>
                <select
                  id="convenio"
                  className="select-field" 
                  value={modalPagamento.paciente.convenio} 
                  onChange={e => setModalPagamento({...modalPagamento, paciente:{...modalPagamento.paciente, convenio:e.target.value}})}
                >
                  <option value="">Selecione</option>
                  {CONVENIOS_LIST.map(conv => (
                    <option key={conv} value={conv}>{conv}</option>
                  ))}
                </select>
              </div>
              <CurrencyInput
                id="valor"
                label="Valor da consulta (R$)"
                value={modalPagamento.valor}
                onChange={newValue => setModalPagamento({...modalPagamento, valor: newValue})}
              />

              <CurrencyInput
                id="desconto"
                label="Desconto aplicado (R$)"
                value={modalPagamento.desconto}
                onChange={newValue => setModalPagamento({...modalPagamento, desconto: newValue})}
              />
              
              <div className="form-group">
                <label htmlFor="forma">Forma de pagamento</label>
                <select 
                  id="forma"
                  className="select-field" 
                  value={modalPagamento.forma_pagamento} 
                  onChange={e => setModalPagamento({...modalPagamento, forma_pagamento:e.target.value})}
                >
                  <option>Dinheiro</option>
                  <option>Cartão</option>
                  <option>Pix</option>
                  <option>Transferência</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vencimento">Data de vencimento</label>
                <input 
                  id="vencimento"
                  className="input-field" 
                  type="date" 
                  value={modalPagamento.data_vencimento} 
                  onChange={e => setModalPagamento({...modalPagamento, data_vencimento:e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status do pagamento</label>
                <select 
                  id="status"
                  className="select-field" 
                  value={modalPagamento.status} 
                  onChange={e => setModalPagamento({...modalPagamento, status:e.target.value})}
                >
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="observacoes">Observações financeiras</label>
                <textarea 
                  id="observacoes"
                  className="input-field" 
                  rows={3} 
                  value={modalPagamento.observacoes} 
                  onChange={e => setModalPagamento({...modalPagamento, observacoes:e.target.value})} 
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn" onClick={() => handleSave(modalPagamento)}>
                Salvar
              </button>
              <button 
                className="action-btn" 
                onClick={closeModal} 
                style={{ borderColor: '#d1d5db', color: '#4b5563' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
