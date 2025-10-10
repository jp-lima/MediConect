import React, { useState, useEffect, useRef } from 'react';
import './botaoacessibilidade.css'; // Importando o CSS
import { setTheme } from '../assets/static/js/components/dark';

function BotaoAcessibilidade() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReadOnHoverActive, setIsReadOnHoverActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastSpokenTargetRef = useRef(null);

  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light", true);
  }, [isDarkMode]);

  useEffect(() => {
    if (!isReadOnHoverActive) {
      window.speechSynthesis.cancel();
      return;
    }
    const handleMouseOver = (event) => {
      const target = event.target;
      if (target && target !== lastSpokenTargetRef.current && target.innerText) {
        const text = target.innerText.trim();
        if (text.length > 0 && ['P', 'H1', 'H2', 'H3', 'BUTTON', 'A', 'LI', 'LABEL'].includes(target.tagName)) {
          lastSpokenTargetRef.current = target;
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'pt-BR';
          window.speechSynthesis.speak(utterance);
        }
      }
    };
    document.body.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      window.speechSynthesis.cancel();
    };
  }, [isReadOnHoverActive]);

  const handleVlibrasClick = () => {
    const originalVlibrasButton = document.querySelector('[vw-access-button]');
    if (originalVlibrasButton) {
      originalVlibrasButton.click();
    } else {
      alert("O Vlibras não pôde ser ativado.");
    }
    setIsMenuOpen(false);
  };

  const handleReadAloud = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Por favor, selecione um texto para ler em voz alta.");
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`container-acessibilidade ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`menu-opcoes ${isMenuOpen ? 'aberto' : ''}`}>
        <div className="menu-titulo">Acessibilidade</div>
        <label htmlFor="darkModeCheckbox" className="checkbox-label-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          Modo Escuro
          <input
            type="checkbox"
            id="darkModeCheckbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
        </label>
        <label htmlFor="readOnHoverCheckbox" className="checkbox-label-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>
          Leitura instantânea
          <input
            type="checkbox"
            id="readOnHoverCheckbox"
            checked={isReadOnHoverActive}
            onChange={() => setIsReadOnHoverActive(!isReadOnHoverActive)}
          />
        </label>
        <button onClick={handleVlibrasClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.3" /></svg>
          Traduzir para LIBRAS
        </button>
      </div>
      <button
        className="botao-flutuante-acessibilidade"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Menu de Acessibilidade"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      </button>
    </div>
  );
}

export default BotaoAcessibilidade;

