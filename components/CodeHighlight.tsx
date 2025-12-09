// components/CodeHighlight.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlightProps {
  code: string;
  language?: string;
  isDark?: boolean;
}

export const CodeHighlight: React.FC<CodeHighlightProps> = ({ 
  code, 
  language = 'python',
  isDark = true 
}) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? vscDarkPlus : vs}
      customStyle={{
        fontSize: '14px',
        lineHeight: '1.6',
        margin: 0,
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
      showLineNumbers={false}
      wrapLines={false}
    >
      {code}
    </SyntaxHighlighter>
  );
};