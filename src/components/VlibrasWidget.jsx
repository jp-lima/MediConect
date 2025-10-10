// src/components/VlibrasWidget.jsx

import React, { useEffect } from 'react';

const VlibrasWidget = () => {
  useEffect(() => {
    // Cria o elemento div principal do Vlibras
    const vwDiv = document.createElement('div');
    vwDiv.setAttribute('vw', '');
    vwDiv.classList.add('enabled');
    vwDiv.id = 'vlibras-div'; // 🔹 ADICIONADO: ID para remoção segura

    const vwAccessButton = document.createElement('div');
    vwAccessButton.setAttribute('vw-access-button', '');
    vwAccessButton.classList.add('active');
    
    const vwPluginWrapper = document.createElement('div');
    vwPluginWrapper.setAttribute('vw-plugin-wrapper', '');
    
    const vwPluginTopWrapper = document.createElement('div');
    vwPluginTopWrapper.classList.add('vw-plugin-top-wrapper');
    
    vwPluginWrapper.appendChild(vwPluginTopWrapper);
    vwDiv.appendChild(vwAccessButton);
    vwDiv.appendChild(vwPluginWrapper);

    document.body.appendChild(vwDiv);

    // Adiciona o script principal do Vlibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.id = 'vlibras-script'; // 🔹 ADICIONADO: ID para remoção segura

    script.onload = () => {
      // Inicializa o widget após o script carregar
      // Certifica-se que a API está disponível globalmente
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    
    document.body.appendChild(script);

    // 🔹 ATUALIZADO: Função de limpeza para remover os elementos pelos IDs
    return () => {
      const existingVwDiv = document.getElementById('vlibras-div');
      if (existingVwDiv) {
        document.body.removeChild(existingVwDiv);
      }
      
      const existingScript = document.getElementById('vlibras-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  return null; // Este componente não renderiza nada visualmente
};

export default VlibrasWidget;