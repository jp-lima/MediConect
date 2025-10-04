import React, { useState, useRef, useEffect } from 'react';
import './styleMedico/chat.css'; // Importa o ficheiro de estilos

// --- DADOS MOCK (Simulação de um banco de dados) ---
const conversationsData = [
    {
        id: 1,
        patientName: 'Ana Costa',
        avatarUrl: 'https://placehold.co/100x100/E2D9FF/6B46C1?text=AC',
        lastMessage: 'Ok, doutor. Muito obrigada!',
        timestamp: '10:45',
        unread: 2,
        messages: [
            { id: 1, sender: 'Ana Costa', text: 'Boa tarde, doutor. Estou sentindo uma dor de cabeça persistente desde ontem.', time: '09:15' },
            { id: 2, sender: 'Você', text: 'Olá, Ana. Além da dor de cabeça, você tem algum outro sintoma, como febre ou enjoo?', time: '09:17' },
            { id: 3, sender: 'Ana Costa', text: 'Não, apenas a dor de cabeça mesmo. É uma pressão na parte da frente.', time: '09:20' },
            { id: 4, sender: 'Você', text: 'Entendido. Por favor, continue monitorando e me avise se piorar. Recomendo repouso e boa hidratação.', time: '09:22' },
            { id: 5, sender: 'Ana Costa', text: 'Ok, doutor. Muito obrigada!', time: '10:45' },
        ],
    },
    {
        id: 2,
        patientName: 'Carlos Andrade',
        avatarUrl: 'https://placehold.co/100x100/D1E7DD/146C43?text=CA',
        lastMessage: 'Amanhã, às 14h, está ótimo.',
        timestamp: 'Ontem',
        unread: 0,
        messages: [
            { id: 1, sender: 'Carlos Andrade', text: 'Doutor, preciso remarcar minha consulta de amanhã.', time: 'Ontem' },
            { id: 2, sender: 'Você', text: 'Claro, Carlos. Qual seria o melhor horário para você?', time: 'Ontem' },
            { id: 3, sender: 'Carlos Andrade', text: 'Amanhã, às 14h, está ótimo.', time: 'Ontem' },
        ],
    },
    {
        id: 3,
        patientName: 'Juliana Oliveira',
        avatarUrl: 'https://placehold.co/100x100/F8D7DA/842029?text=JO',
        lastMessage: 'O resultado do exame ficou pronto.',
        timestamp: 'Sexta-feira',
        unread: 0,
        messages: [
            { id: 1, sender: 'Juliana Oliveira', text: 'O resultado do exame ficou pronto.', time: 'Sexta-feira' }
        ],
    },
    {
        id: 4,
        patientName: 'Ricardo Pereira',
        avatarUrl: 'https://placehold.co/100x100/FFF3CD/856404?text=RP',
        lastMessage: 'Estou me sentindo muito melhor, obrigado!',
        timestamp: 'Quinta-feira',
        unread: 0,
        messages: [
            { id: 1, sender: 'Ricardo Pereira', text: 'Estou me sentindo muito melhor, obrigado!', time: 'Quinta-feira' }
        ],
    },
];

// --- COMPONENTES ---

const ConversationListItem = ({ conversation, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`conversation-item ${isActive ? 'active' : ''}`}
    >
        <img src={conversation.avatarUrl} alt={conversation.patientName} className="avatar" />
        <div className="conversation-details">
            <div className="conversation-header">
                <p className="patient-name">{conversation.patientName}</p>
                <span className="timestamp">{conversation.timestamp}</span>
            </div>
            <div className="conversation-body">
                <p className="last-message">{conversation.lastMessage}</p>
                {conversation.unread > 0 && (
                    <span className="unread-badge">{conversation.unread}</span>
                )}
            </div>
        </div>
    </div>
);

const ChatMessage = ({ message, isDoctor }) => (
    <div className={`message-container ${isDoctor ? 'sent' : 'received'}`}>
        <div className="message-bubble">
            <p className="message-text">{message.text}</p>
            <p className="message-time">{message.time}</p>
        </div>
    </div>
);

const App = () => {
    const [conversations, setConversations] = useState(conversationsData);
    const [activeConversationId, setActiveConversationId] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // ✅ 1. Estado para a busca
    const chatEndRef = useRef(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageToSend = {
            id: Date.now(),
            sender: 'Você',
            text: newMessage,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedConversations = conversations.map(convo => {
            if (convo.id === activeConversationId) {
                return {
                    ...convo,
                    messages: [...convo.messages, messageToSend],
                    lastMessage: newMessage,
                    timestamp: 'Agora'
                };
            }
            return convo;
        });

        setConversations(updatedConversations);
        setNewMessage('');
    };

    const handleConversationClick = (id) => {
        setActiveConversationId(id);
        const updatedConversations = conversations.map(convo =>
            convo.id === id ? { ...convo, unread: 0 } : convo
        );
        setConversations(updatedConversations);
    };

    // ✅ 2. Lógica para filtrar as conversas
    const filteredConversations = conversations.filter(conversation =>
        conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-app-container">
            {/* Barra Lateral de Conversas */}
            <aside className="sidebar">
                <header className="sidebar-header">
                    <h1>Mensagens</h1>
                    <div className="search-container">
                        {/* ✅ 3. Conecta o input ao estado e à função de atualização */}
                        <input
                            type="text"
                            placeholder="Pesquisar paciente..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </header>
                <div className="conversation-list">
                    {/* ✅ 4. Usa a lista filtrada para renderizar os itens */}
                    {filteredConversations.map(convo => (
                        <ConversationListItem
                            key={convo.id}
                            conversation={convo}
                            isActive={convo.id === activeConversationId}
                            onClick={() => handleConversationClick(convo.id)}
                        />
                    ))}
                </div>
            </aside>

            {/* Painel Principal do Chat */}
            <main className="main-chat">
                {activeConversation ? (
                    <>
                        <header className="chat-header">
                            <img src={activeConversation.avatarUrl} alt={activeConversation.patientName} className="avatar" />
                            <div>
                                <h2 className="chat-patient-name">{activeConversation.patientName}</h2>
                                <p className="chat-status">Online</p>
                            </div>
                        </header>
                        <div className="messages-body">
                            {activeConversation.messages.map(msg => (
                                <ChatMessage key={msg.id} message={msg} isDoctor={msg.sender === 'Você'} />
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <footer className="message-footer">
                            <form onSubmit={handleSendMessage} className="message-form">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="message-input"
                                    autoComplete="off"
                                />
                                <button type="submit" className="send-button">
                                    <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="no-conversation-selected">
                        {/* Adicionado uma verificação para quando a busca não encontra resultados */}
                        {searchTerm && filteredConversations.length === 0 ? (
                             <p>Nenhum paciente encontrado com o nome "{searchTerm}".</p>
                        ) : (
                            <p>Selecione uma conversa para começar.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;