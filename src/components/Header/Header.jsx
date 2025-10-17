import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSuporteCardOpen, setIsSuporteCardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const chatInputRef = useRef(null);
  const mensagensContainerRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (mensagensContainerRef.current) {
      mensagensContainerRef.current.scrollTop = mensagensContainerRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Funções de Logout (do seu código)
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken") ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken");

      if (token) {
        const response = await fetch(
          "https://mock.apidog.com/m1/1053378-0-default/auth/v1/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 204) console.log("Logout realizado com sucesso");
        else if (response.status === 401) console.log("Token inválido ou expirado");
        else {
          try {
            const errorData = await response.json();
            console.error("Erro no logout:", errorData);
          } catch {
            console.error("Erro no logout - status:", response.status);
          }
        }
      }

      clearAuthData();
      navigate("/login");
    } catch (error) {
      console.error("Erro durante logout:", error);
      clearAuthData();
      navigate("/login");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const clearAuthData = () => {
    ["token","authToken","userToken","access_token","user","auth","userData"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes("auth") || name.includes("api")) caches.delete(name);
        });
      });
    }
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isSuporteCardOpen) setIsSuporteCardOpen(false);
    if (isChatOpen) setIsChatOpen(false);
  };

  const handleViewProfile = () => {
    navigate('/perfil'); 
    setIsDropdownOpen(false);
  };

  const handleSuporteClick = () => {
    setIsSuporteCardOpen(!isSuporteCardOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
    if (isChatOpen) setIsChatOpen(false);
  };

  const handleCloseSuporteCard = () => {
    setIsSuporteCardOpen(false);
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
    setIsSuporteCardOpen(false);
    setMensagens([
      {
        id: 1,
        texto: 'Olá! Bem-vindo ao suporte Mediconnect. Como podemos ajudar você hoje?',
        remetente: 'suporte',
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setMensagem('');
  };

  const handleEnviarMensagem = (e) => {
    e.preventDefault();
    if (mensagem.trim() === '') return;

    const novaMensagemUsuario = {
      id: Date.now(),
      texto: mensagem,
      remetente: 'usuario',
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setMensagem('');

    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 0);

    setTimeout(() => {
      const respostas = [
        'Entendi sua dúvida. Vou verificar isso para você.',
        'Obrigado pela informação. Estou analisando seu caso.',
        'Pode me dar mais detalhes sobre o problema?',
        'Já encaminhei sua solicitação para nossa equipe técnica.',
        'Vou ajudar você a resolver isso!'
      ];
      
      const respostaSuporte = {
        id: Date.now() + 1,
        texto: respostas[Math.floor(Math.random() * respostas.length)],
        remetente: 'suporte',
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMensagens(prev => [...prev, respostaSuporte]);
    }, 1000);
  };

  const SuporteCard = () => (
    <div className="suporte-card">
      <h2 className="suporte-titulo">Suporte</h2>
      <p className="suporte-subtitulo">Entre em contato conosco através dos canais abaixo</p>
      
      <div className="contato-item">
        <div className="contato-info">
          <div className="contato-nome">Email</div>
          <div className="contato-descricao">suporte@mediconnect.com</div>
        </div>
      </div>
      
      <div className="contato-item">
        <div className="contato-info">
          <div className="contato-nome">Telefone</div>
          <div className="contato-descricao">(11) 3333-4444</div>
        </div>
      </div>
      
      <div className="contato-item clickable" onClick={handleChatClick}>
        <div className="contato-info">
          <div className="contato-nome">Chat Online</div>
          <div className="contato-descricao">Disponível 24/7</div>
        </div>
      </div>
    </div>
  );

  const ChatOnline = () => (
    <div className="chat-online">
      <div className="chat-header">
        <h3 className="chat-titulo">Chat de Suporte</h3>
        <button type="button" className="fechar-chat" onClick={handleCloseChat}>×</button>
      </div>
      
      <div className="chat-mensagens" ref={mensagensContainerRef}>
        {mensagens.map((msg) => (
          <div key={msg.id} className={`mensagem ${msg.remetente}`}>
            <div className="mensagem-texto">{msg.texto}</div>
            <div className="mensagem-hora">{msg.hora}</div>
          </div>
        ))}
      </div>
      
      <form className="chat-input" onSubmit={handleEnviarMensagem}>
        <input
          ref={chatInputRef}
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="chat-campo"
          autoFocus
        />
        <button type="submit" className="chat-enviar">Enviar</button>
      </form>
    </div>
  );

  return (
    <div className="header-container">
      <div className="right-corner-elements">
        <div className="phone-icon-container" onClick={handleSuporteClick}>
          <span className="phone-icon" role="img" aria-label="telefone">📞</span>
        </div>

        <div className="profile-section">
          <div className="profile-picture-container" onClick={handleProfileClick}>
            <div className="profile-placeholder"></div> 
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button type="button" onClick={handleViewProfile} className="dropdown-button">Ver Perfil</button>
              <button type="button" onClick={handleLogoutClick} className="dropdown-button logout-button">Sair (Logout)</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Logout */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <h3>Confirmar Logout</h3>
            <p>Tem certeza que deseja encerrar a sessão?</p>
            <div className="logout-modal-buttons">
              <button onClick={handleLogoutCancel} className="logout-cancel-button">
                Cancelar
              </button>
              <button onClick={handleLogoutConfirm} className="logout-confirm-button">
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuporteCardOpen && (
        <div className="suporte-card-overlay" onClick={handleCloseSuporteCard}>
          <div className="suporte-card-container" onClick={(e) => e.stopPropagation()}>
            <SuporteCard />
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="chat-overlay">
          <div className="chat-container">
            <ChatOnline />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;