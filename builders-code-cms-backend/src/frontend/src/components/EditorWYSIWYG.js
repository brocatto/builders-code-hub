import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from '../../../services/api';

const EditorWYSIWYG = ({ initialValue = '', onChange, placeholder = 'Digite seu conteúdo aqui...' }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorData, setEditorData] = useState(initialValue);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    setEditorData(initialValue);
  }, [initialValue]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  const editorConfiguration = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo'
    ],
    placeholder: placeholder,
    language: 'pt-br'
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-md overflow-hidden">
      {editorLoaded ? (
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={editorData}
          onChange={handleEditorChange}
        />
      ) : (
        <div className="p-4 text-gray-400">Carregando editor...</div>
      )}
    </div>
  );
};

export default EditorWYSIWYG;
