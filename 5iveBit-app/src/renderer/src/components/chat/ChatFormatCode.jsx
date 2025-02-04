import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { funky } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ChatFormatCode.module.css';
import AskUserButtons from '../shared/AskUserButtons';

export const formatMessage = (
  content,
  copyToClipboard,
  role,
  handleUpdateFile,
  currentUploadedFiles,
  handleDownloadChatFile
) => {
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    // Determine if the code block is inline
    const isInline = inline || node.position?.start.line === node.position?.end.line;

    if (isInline) {
      return (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      );
    }

    // Handle block code (triple backticks)
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'file'; // Default to 'file' if no language is specified
    const code = String(children).replace(/\n$/, ''); // Remove trailing newline

    return (
      <div className={styles.codeBlock}>
        {/* Copy Button */}
        <IconButton
          onClick={() => copyToClipboard(code)}
          className={styles.copyButton}
          title="Copy code"
        >
          <ContentCopyIcon className={styles.copyIcon} />
        </IconButton>

        {/* Language Label */}
        <div className={styles.codeHeader}>
          <span className={styles.languageLabel}>{language}</span>
        </div>

        {/* Syntax Highlighter for Block Code */}
        <SyntaxHighlighter
          language={language}
          style={funky}
          PreTag="div"
          className={styles.codeContent}
        >
          {code}
        </SyntaxHighlighter>

        {/* Optional User Action Buttons */}
        {role !== 'user' &&
          (currentUploadedFiles.length !== 0 ? (
            <>
              <p>Do you want to update the uploaded file with this code?</p>
              <AskUserButtons
                options={[
                  {
                    label: 'update',
                    onclick: () => handleUpdateFile(code),
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
                    onclick: () => handleDownloadChatFile(code),
                    color: 'white',
                    bgcolor: '#015050'
                  }
                ]}
              />
            </>
          ))}
      </div>
    );
  };

  return (
    <ReactMarkdown
      components={{
        // Handlers for various Markdown elements
        h1: ({ children }) => <h1 className={styles.heading1}>{children}</h1>,
        h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
        h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
        p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className={styles.blockquote}>{children}</blockquote>
        ),
        ul: ({ children }) => <ul className={styles.unorderedList}>{children}</ul>,
        ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
        li: ({ children }) => <li className={styles.listItem}>{children}</li>,
        strong: ({ children }) => <strong className={styles.boldText}>{children}</strong>,
        code: ({ node, inline, className, children, ...props }) => (
          <CodeBlock
            node={node}
            inline={inline}
            className={className}
            children={children}
            {...props}
            copyToClipboard={copyToClipboard}
            role={role}
            handleUpdateFile={handleUpdateFile}
            currentUploadedFiles={currentUploadedFiles}
            handleDownloadChatFile={handleDownloadChatFile}
          />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// Helper function to detect likely code
export const isLikelyCode = (text) => {
  const codePatterns = [
    '{',
    '}',
    ';',
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
