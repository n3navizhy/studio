'use client';

import React, {useState, useRef, useEffect} from 'react';
import {cn} from '@/lib/utils';
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({code, onChange, className}) => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const handleOnChange = (value) => {
    onChange(value);
  }

  return (
    <Editor
      height="400px"
      width="100%"
      theme="vs-dark"
      language="python"
      value={code}
      onChange={handleOnChange}
      onMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;
