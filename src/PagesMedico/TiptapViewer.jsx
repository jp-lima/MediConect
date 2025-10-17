import React from 'react';

// Componente para renderizar o HTML salvo (conteúdo do editor)
const TiptapViewer = ({ htmlContent }) => {
  return (
    // 'dangerouslySetInnerHTML' é necessário para renderizar HTML
    <div 
      className="tiptap-viewer"
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
      style={{ border: '1px dashed #eee', padding: '10px' }} // Estilo opcional para destacar o conteúdo
    />
  );
};

export default TiptapViewer;