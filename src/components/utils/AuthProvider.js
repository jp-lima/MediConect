import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Criação do Contexto
const AuthContext = createContext(null);

// Hook customizado para facilitar o uso nos componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Isso é crucial para evitar o erro "useAuth() is undefined"
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// O Provedor Principal
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // 🔑 Carrega o token do localStorage na inicialização
  useEffect(() => {
    // Essa lógica garante que o token permanece após o refresh da página
    const storedToken = localStorage.getItem('access_token');
    const storedTokenType = localStorage.getItem('token_type');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedToken && storedTokenType) {
      setAccessToken(storedToken);
      setTokenType(storedTokenType);
      // O refreshToken é essencial para a renovação futura
      setRefreshToken(storedRefreshToken); 
    }
  }, []); 

  // --- FUNÇÕES DE MUDANÇA (SET/CLEAR) ---

  /**
   * Função para salvar os tokens após um login ou renovação (refresh).
   * @param {Object} tokenResponse O objeto completo retornado pelo Supabase Auth.
   */
  const setAuthTokens = (tokenResponse) => {
    if (tokenResponse && tokenResponse.access_token && tokenResponse.token_type) {
      // 1. Atualiza o estado do React
      setAccessToken(tokenResponse.access_token);
      setTokenType(tokenResponse.token_type);
      setRefreshToken(tokenResponse.refresh_token);

      // 2. Persiste no localStorage (para não perder ao recarregar a página)
      localStorage.setItem('access_token', tokenResponse.access_token);
      localStorage.setItem('token_type', tokenResponse.token_type);
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);
    }
  };

  /**
   * Função para remover todos os tokens (Logout).
   */
  const clearAuthTokens = () => {
    setAccessToken(null);
    setTokenType(null);
    setRefreshToken(null);
    // Remove do localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('refresh_token');
  };

  // --- FUNÇÕES DE USO (GET) ---

  /**
   * Retorna a string completa para o cabeçalho Authorization (ex: "Bearer <token>").
   */
  const getAuthorizationHeader = () => 
    accessToken && tokenType ? `${tokenType} ${accessToken}` : '';
  
  // --- VALOR DO CONTEXTO ---

  const contextValue = {
    accessToken,
    tokenType,
    refreshToken,
    isAuthenticated: !!accessToken,
    setAuthTokens, // Usado para CRIAR/MUDAR (Login/Refresh)
    clearAuthTokens, // Usado para MUDAR (Logout)
    getAuthorizationHeader, // Usado para PEGAR (Endpoints)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}