'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      className={cn(
        "w-full h-64 p-4 font-mono text-sm bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-none",
        className
      )}
      value={code}
      onChange={handleChange}
      placeholder="Напишите свой код Python здесь..."
    />
  );
};

export default CodeEditor;
