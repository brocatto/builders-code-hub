import React, { useState, useEffect } from 'react';

const EditorWYSIWYG = ({ initialValue = '', onChange, placeholder = 'Digite seu conteúdo aqui...' }) => {
  const [editorData, setEditorData] = useState(initialValue);

  useEffect(() => {
    setEditorData(initialValue);
  }, [initialValue]);

  const handleEditorChange = (e) => {
    const data = e.target.value;
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="bg-gray-50 border-b border-gray-300 p-2 rounded-t-md">
        <div className="text-sm text-gray-600">Editor de Texto</div>
      </div>
      <textarea
        value={editorData}
        onChange={handleEditorChange}
        placeholder={placeholder}
        className="w-full p-3 border-0 resize-none focus:ring-0 focus:outline-none rounded-b-md"
        rows={10}
        style={{ minHeight: '200px' }}
      />
    </div>
  );
};

export default EditorWYSIWYG;