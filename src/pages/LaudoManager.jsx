// src/pages/LaudoManager.jsx
import React, { useState, useEffect } from "react";
import "./LaudoStyle.css"; // Importa o CSS externo

/* ===== Mock data (simula APIDOG) ===== */
function mockFetchLaudos() {
  return [
    {
      id: "LAU-300551296",
      pedido: 300551296,
      data: "29/07/2025",
      paciente: { nome: "Sarah Mariana Oliveira", cpf: "616.869.070-**", nascimento: "1990-03-25", convenio: "Unimed" },
      solicitante: "Sandro Rangel Santos",
      exame: "US - Abdome Total",
      conteudo: "RELATÓRIO MÉDICO\n\nAchados: Imagens compatíveis com ...\nConclusão: Órgãos sem alterações significativas.",
      status: "rascunho"
    },
    {
      id: "LAU-300659170",
      pedido: 300659170,
      data: "29/07/2025",
      paciente: { nome: "Laissa Helena Marquetti", cpf: "950.684.57-**", nascimento: "1986-09-12", convenio: "Bradesco" },
      solicitante: "Sandro Rangel Santos",
      exame: "US - Mamária Bilateral",
      conteudo: "RELATÓRIO MÉDICO\n\nAchados: text...",
      status: "liberado"
    },
    {
      id: "LAU-300658301",
      pedido: 300658301,
      data: "28/07/2025",
      paciente: { nome: "Vera Lúcia Oliveira Santos", cpf: "928.005.**", nascimento: "1979-02-02", convenio: "Particular" },
      solicitante: "Dr. Fulano",
      exame: "US - Transvaginal",
      conteudo: "RELATÓRIO MÉDICO\n\nAchados: ...",
      status: "entregue"
    }
  ];
}

function mockDeleteLaudo(id) {
  return new Promise((res) => setTimeout(() => res({ ok: true }), 500));
}

/* ===== Componente ===== */
export default function LaudoManager() {
  const [laudos, setLaudos] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  /* viewerLaudo é usado para mostrar o editor/leitura;
     previewLaudo é usado para a pré-visualização (sem bloquear) */
  const [viewerLaudo, setViewerLaudo] = useState(null);
  const [previewLaudo, setPreviewLaudo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* notificação simples (sem backdrop) para 'sem permissão' */
  const [showNoPermission, setShowNoPermission] = useState(false);

  /* pesquisa */
  const [query, setQuery] = useState("");

  /* Para simplificar: eu assumo aqui que estamos na visão da secretaria */
  const isSecretary = true; // permanece true (somente leitura)

  useEffect(() => {
    // Importa os dados mock apenas
    const data = mockFetchLaudos();
    setLaudos(data);
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function onDocClick(e) {
      if (e.target.closest && e.target.closest('.action-btn')) return;
      if (e.target.closest && e.target.closest('.dropdown')) return;
      setOpenDropdownId(null);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function toggleDropdown(id, e) {
    e.stopPropagation();
    setOpenDropdownId(prev => (prev === id ? null : id));
  }

  /* (botao editar) */
  function handleOpenViewer(laudo) {
    setOpenDropdownId(null);
    if (isSecretary) {
      // (notificação sem bloquear)
      setShowNoPermission(true);
      return;
    }
    setViewerLaudo(laudo);
  }

  /* (botao imprimir) */
  function handlePrint(laudo) {
    // evitar bug: fechar viewer antes de abrir preview
    setViewerLaudo(null);
    setPreviewLaudo(laudo);
    setShowPreview(true);
    setOpenDropdownId(null);
  }

  /* (botao excluir) */
  function handleRequestDelete(laudo) {
    setToDelete(laudo);
    setOpenDropdownId(null);
    setShowConfirmDelete(true);
  }

  /* (funcionalidade do botao de excluir) */
  async function doConfirmDelete(confirm) {
    if (!toDelete) return;
    if (!confirm) {
      setShowConfirmDelete(false);
      setToDelete(null);
      return;
    }
    setLoadingDelete(true);
    try {
      const resp = await mockDeleteLaudo(toDelete.id);
      if (resp.ok || resp === true) {
        // removo o laudo da lista local
        setLaudos(curr => curr.filter(l => l.id !== toDelete.id));
        setShowConfirmDelete(false);
        setToDelete(null);
        alert("Laudo excluído com sucesso.");
      } else {
        alert("Erro ao excluir. Tente novamente.");
      }
    } catch (err) {
      alert("Erro de rede ao excluir.");
    } finally {
      setLoadingDelete(false);
    }
  }

  /* filtro de pesquisa (por pedido ou nome do paciente) */
  const normalized = (s = "") => String(s).toLowerCase();
  const filteredLaudos = laudos.filter(l => {
    const q = normalized(query).trim();
    if (!q) return true;
    if (normalized(l.pedido).includes(q)) return true;
    if (normalized(l.paciente?.nome).includes(q)) return true;
    return false;
  });

  return (
    <div className="laudo-wrap">
      <div className="left-col">
        <div className="title-row">
          <div>
            <div className="page-title">Gerenciamento de Laudo</div>
            {/* removi a linha "Visualização: Secretaria" conforme pedido */}
          </div>
        </div>

        <div style={{ marginBottom:12 }}>
          <input
            placeholder="Pesquisar paciente ou pedido..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e6eef8" }}
          />
        </div>

        {filteredLaudos.length === 0 ? (
          <div className="empty">Nenhum laudo encontrado.</div>
        ) : (
          <div style={{ borderRadius:8, overflow:"visible", boxShadow:"0 0 0 1px #eef6ff" }}>
            {filteredLaudos.map((l) => (
              <div className="laudo-row" key={l.id}>
                <div className="col" style={{ flex: "0 0 160px" }}>
                  <div style={{ fontWeight:700 }}>{l.pedido}</div>
                  <div className="small-muted">{l.data}</div>
                </div>
                <div className="col" style={{ flex:2 }}>
                  <div style={{ fontWeight:600 }}>{l.paciente.nome}</div>
                  <div className="small-muted">{l.paciente.cpf} • {l.paciente.convenio}</div>
                </div>
                <div className="col" style={{ flex:1 }}>{l.exame}</div>
                <div className="col small">{l.solicitante}</div>
                <div className="col small" style={{ flex: "0 0 80px", textAlign:"left" }}>{l.status}</div>

                <div className="row-actions">
                  <div className="action-btn" onClick={(e)=> toggleDropdown(l.id, e)} title="Ações">
                    <i class="bi bi-three-dots-vertical"></i>
                  </div>

                  {openDropdownId === l.id && (
                    <div className="dropdown" data-laudo-dropdown={l.id}>
                      <div className="item" onClick={() => handleOpenViewer(l)}>Editar</div>
                      <div className="item" onClick={() => handlePrint(l)}>Imprimir</div>
                      <div className="item" onClick={() => { alert("Protocolo de entrega: formulário (não implementado)."); setOpenDropdownId(null); }}>Protocolo de entrega</div>
                      <div className="item" onClick={() => { alert("Liberar laudo: requer permissão de médico. (não implementado)"); setOpenDropdownId(null); }}>Liberar laudo</div>
                      <div className="item" onClick={() => handleRequestDelete(l)} style={{ color:"#c23b3b" }}>Excluir laudo</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Viewer modal (modo leitura) — só abre para quem tem permissão */}
      {viewerLaudo && !showPreview && !isSecretary && (
        <div className="viewer-modal" style={{ pointerEvents:"auto" }}>
          <div className="modal-backdrop" onClick={() => setViewerLaudo(null)} />
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="viewer-header">
              <div>
                <div style={{ fontSize:18, fontWeight:700 }}>{viewerLaudo.paciente.nome}</div>
                <div className="patient-info">
                  Nasc.: {viewerLaudo.paciente.nascimento} • {computeAge(viewerLaudo.paciente.nascimento)} anos • {viewerLaudo.paciente.cpf} • {viewerLaudo.paciente.convenio}
                </div>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button className="tool-btn" onClick={() => { setPreviewLaudo(viewerLaudo); setShowPreview(true); setViewerLaudo(null); }}>Pré-visualizar / Imprimir</button>
                <button className="tool-btn" onClick={() => setViewerLaudo(null)}>Fechar</button>
              </div>
            </div>

            <div className="toolbar">
              <div className="tool-btn">B</div>
              <div className="tool-btn"><i>I</i></div>
              <div className="tool-btn"><u>U</u></div>
              <div className="tool-btn">Fonte</div>
              <div className="tool-btn">Tamanho</div>
              <div className="tool-btn">Lista</div>
              <div className="tool-btn">Campos</div>
              <div className="tool-btn">Modelos</div>
              <div className="tool-btn">Imagens</div>
            </div>

            <div className="editor-area" aria-readonly>
              {viewerLaudo.conteudo.split("\n").map((line, i) => (
                <p key={i} style={{ margin: line.trim()==="" ? "8px 0" : "6px 0" }}>{line}</p>
              ))}
            </div>

            <div className="footer-controls">
              <div className="toggle small-muted">
                <label><input type="checkbox" disabled /> Pré-visualização</label>
                <label style={{ marginLeft:12 }}><input type="checkbox" disabled /> Ocultar data</label>
                <label style={{ marginLeft:12 }}><input type="checkbox" disabled /> Ocultar assinatura</label>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button className="btn secondary" onClick={() => { if(window.confirm("Cancelar e voltar à lista? Todas alterações não salvas serão perdidas.")) setViewerLaudo(null); }}>Cancelar</button>
                <button className="btn primary" onClick={() => alert("Salvar (não implementado para secretaria).")}>Salvar laudo</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal — agora não bloqueia a tela (sem backdrop escuro), botão imprimir é interativo */}
      {showPreview && previewLaudo && (
        <div className="preview-modal" style={{ pointerEvents:"none" /* container não bloqueia */ }}>
          <div /* sem backdrop, assim não deixa a tela escura/blocked */ />
          <div className="modal-card" style={{ maxWidth:900, pointerEvents:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontWeight:700 }}>Pré-visualização - {previewLaudo.paciente.nome}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="tool-btn" onClick={() => alert("Imprimir (simulado).")}>Imprimir / Download</button>
                <button className="tool-btn" onClick={() => { setShowPreview(false); setPreviewLaudo(null); }}>Fechar</button>
              </div>
            </div>

            <div style={{ border: "1px solid #e6eef8", borderRadius:6, padding:18, background:"#fff" }}>
              <div style={{ marginBottom:8, fontSize:14, color:"#33475b" }}>
                <strong>RELATÓRIO MÉDICO</strong>
              </div>
              <div style={{ marginBottom:14, fontSize:13, color:"#546b7f" }}>
                {previewLaudo.paciente.nome} • Nasc.: {previewLaudo.paciente.nascimento} • CPF: {previewLaudo.paciente.cpf}
              </div>

              <div style={{ whiteSpace:"pre-wrap", fontSize:15, color:"#1f2d3d", lineHeight:1.5 }}>
                {previewLaudo.conteudo}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificação simples: Sem permissão (exibe sem backdrop escuro) - centralizada */}
      {showNoPermission && (
        <div className="notice-card" role="alert" aria-live="polite">
          <div style={{ fontWeight:700, marginBottom:6 }}>Sem permissão para editar</div>
          <div style={{ marginBottom:10, color:"#5a6f80" }}>Você está na visualização da secretaria. Edição disponível somente para médicos autorizados.</div>
          <div style={{ textAlign:"right" }}>
            <button className="tool-btn" onClick={() => setShowNoPermission(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Confirm delete modal (simples: Sim / Não) */}
      {showConfirmDelete && toDelete && (
        <div className="confirm-modal" style={{ pointerEvents:"auto" }}>
          <div className="modal-card" style={{ maxWidth:480 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Confirmar exclusão</div>
            <div style={{ marginBottom:12 }}>Você tem certeza que quer excluir o laudo <strong>{toDelete.pedido} - {toDelete.paciente.nome}</strong> ? Esta ação é irreversível.</div>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <button className="tool-btn" onClick={() => doConfirmDelete(false)} disabled={loadingDelete}>Não</button>
              <button className="tool-btn" onClick={() => doConfirmDelete(true)} disabled={loadingDelete} style={{ background: loadingDelete ? "#d7e8ff" : "#ffecec", border: "1px solid #ffd7d7" }}>
                {loadingDelete ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Helpers ===== */
function computeAge(birth) {
  if (!birth) return "-";
  const [y,m,d] = birth.split("-").map(x => parseInt(x,10));
  if (!y) return "-";
  const today = new Date();
  let age = today.getFullYear() - y;
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  if (mm < m || (mm === m && dd < d)) age--;
  return age;
}
