import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { funky } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ChatFormatCode.module.css';

export const formatMessage = (content, copyToClipboard) => {
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const code = String(children).replace(/\n$/, '');

    return (
      <div className={styles.codeBlock}>
        <IconButton
          onClick={() => copyToClipboard(code)}
          className={styles.copyButton}
          title="Copy code"
        >
          <ContentCopyIcon className={styles.copyIcon} />
        </IconButton>

        <div className={styles.codeHeader}>
          <span className={styles.languageLabel}>{language}</span>
        </div>

        <SyntaxHighlighter
          language={language}
          style={funky}
          PreTag="div"
          className={styles.codeContent}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <ReactMarkdown
      components={{
        code: CodeBlock
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export const isLikelyCode = (text) => {
  const codePatterns = [
    //update if needed
    '{',
    '}',
    ';',
    '//',
    'function',
    'class',
    'const',
    'def ',
    'import ',
    'public ',
    '<script',
    '<style',
    '<div',
    'SELECT ',
    'INSERT ',
    'UPDATE '
  ];

  return codePatterns.some((pattern) => text.includes(pattern));
};
