import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
// Componente da barra de menu (Menu Bar)
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  // Estilos simples para os botões. Você pode e deve estilizar melhor com CSS/Bootstrap.
  const buttonStyle = {
    marginRight: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: editor.isActive('bold') || editor.isActive('italic') ? '#ddd' : 'white',
  };
  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #ccc', display: 'flex', flexWrap: 'wrap' }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        style={{ ...buttonStyle, fontWeight: 'bold' }}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={{ ...buttonStyle, fontStyle: 'italic' }}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={{ ...buttonStyle, backgroundColor: editor.isActive('bulletList') ? '#ddd' : 'white' }}
      >
        Lista
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={{ ...buttonStyle, backgroundColor: editor.isActive('heading', { level: 2 }) ? '#ddd' : 'white' }}
      >
        Título 2
      </button>
      {/* Adicione mais botões conforme a necessidade (link, código, etc.) */}
    </div>
  );
};
// Componente principal do Editor
const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Desativa 'hardBreak' e 'blockquote' se não forem necessários para simplificar
        hardBreak: false,
      }),
      Link, // Adiciona suporte para links
    ],
    content: content || '<p>Inicie o relatório aqui...</p>',
    onUpdate: ({ editor }) => {
      // Quando o conteúdo muda, chama a função onChange com o HTML
      onChange(editor.getHTML());
    },
  });
  return (
    <div className='tiptap-editor-container' style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} style={{ minHeight: '300px', padding: '10px' }} />
    </div>
  );
};
export default TiptapEditor;