import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

// MenuBar simples
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btn = { marginRight: '6px', padding: '4px 8px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: 4 };
  return (
    <div style={{ padding: 8, borderBottom: '1px solid #e6e6e6', display: 'flex', flexWrap: 'wrap' }}>
      <button style={{ ...btn, fontWeight: 'bold' }} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button style={{ ...btn }} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button style={{ ...btn }} onClick={() => editor.chain().focus().toggleBulletList().run()}>Lista</button>
      <button style={{ ...btn }} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Título 2</button>
      <button style={{ ...btn }} onClick={() => { const url = prompt('URL'); if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run(); }}>Link</button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      Link,
    ],
    content: content || '<p>Inicie o relatório aqui...</p>',
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  // Se o pai mudar 'content', atualizamos o editor
  useEffect(() => {
    if (!editor) return;
    // Só setContent se for diferente para evitar perda de edição
    try {
      const current = editor.getHTML();
      if ((content || '').trim() && content !== current) {
        editor.commands.setContent(content);
      }
    } catch (e) {
      // ignore
    }
  }, [editor, content]);

  return (
    <div className='tiptap-editor-container' style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} style={{ minHeight: 360, padding: 12, background: 'white' }} />
    </div>
  );
};

export default TiptapEditor;
