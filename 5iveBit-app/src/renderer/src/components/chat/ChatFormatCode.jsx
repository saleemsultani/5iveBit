import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { funky } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ChatFormatCode.module.css';
import AskUserButtons from '../shared/AskUserButtons';

export const formatMessage = (content, copyToClipboard, role,
  handleUpdateFile,
  currentUploadedFiles,
  handleDownloadChatFile
) => {
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    // Check if parent is pre tag to decide if it's inline code or code block
    const isInline = node.position?.start.line === node.position?.end.line;
    if (isInline) {
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
         {/* ///////////////////////////////// */}
          {/* User permission related code */}
          {role !== 'user' &&
            (currentUploadedFiles.length !== 0 ? (
              <>
                <p>Do you want to update the uploaded file with this code?</p>
                <AskUserButtons
                  options={[
                    {
                      label: 'update',
                      onclick: () => {
                        handleUpdateFile(code);
                      },
                      color: 'white',
                      bgcolor: '#015050'
                    }
                  ]}
                />
              </>
            ) : (
              <>
                <p>Do you want to download this file?</p>
                <AskUserButtons
                  options={[
                    {
                      label: 'download',
                      onclick: () => {
                        handleDownloadChatFile(code);
                      },
                      color: 'white',
                      bgcolor: '#015050'
                    }
                  ]}
                />
              </>
            ))}

          {/* ///////////////////////////////// */}
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
