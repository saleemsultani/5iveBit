import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Prism from 'prismjs';
import 'prismjs/themes/prism-funky.css'; //maybe change syntax theme
import styles from './ChatFormatCode.module.css';


//codeblock formatting
export const formatMessage = (content, copyToClipboard) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3);
      
      // Detect language 
      const firstLine = code.split('\n')[0].trim().toLowerCase();
      let language = 'javascript'; 
      let codeContent = code;

      // file extensions for different languages  - add more if needed
      const languageMap = {  'js': 'javascript',  'javascript': 'javascript', 'jsx': 'jsx', 
        'java': 'java', 'mjs': 'javascript',  'cjs': 'javascript', 'vue': 'javascript', 'tsx': 'javascript',
        'ejs': 'javascript', 'ts': 'typescript',  'typescript': 'typescript',  'python': 'python', 
        'py': 'python',  'c': 'c', 'cpp': 'cpp',  'c++': 'cpp',  'cs': 'c#', 'cs' : 'cs', 'html': 'html', 
        'htm': 'html',  'css': 'css', 'sass': 'stylesheet',  'php': 'php', 'xml': 'xml',  'json': 'json',  
        'yaml': 'yaml',  'yml': 'yaml',  'csv': 'csv',  'xlsx': 'excel', 'xls': 'excel', 'rb': 'ruby', 
         'dart': 'dart', 'sql': 'sql', 'bson': 'nosql', 'md': 'markdown', 'sh': 'shell', 'log': 'log', 
         'syslog': 'syslog'   }

      // Checks if first line indicates a language
      if (languageMap[firstLine]) {
        language = languageMap[firstLine];
        // Removes the language line from the code
        codeContent = code.slice(firstLine.length).trim();
      }

      // Syntax highlighting
      let highlightedCode;
      try {
        const grammar = Prism.languages[language] || Prism.languages.javascript;
        highlightedCode = Prism.highlight(codeContent, grammar, language);
      } catch (error) {
        console.error('Syntax highlighting failed:', error);
        highlightedCode = codeContent;
      }

      return (
        <div key={index} className={styles.codeBlock}>
          <IconButton
            onClick={() => copyToClipboard(codeContent)}
            className={styles.copyButton}
            title="Copy code"
          >
            <ContentCopyIcon className={styles.copyIcon} />
          </IconButton>
          
          <div className={styles.codeHeader}>
            <span className={styles.languageLabel}>{language}</span>
          </div>
          
          <pre className={styles.codeContent}>
            <code 
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              className={`language-${language}`}
            />
          </pre>
        </div>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const isLikelyCode = (text) => {
  const codePatterns = [   //update if needed
    '{', '}', ';', '//',
    'function', 'class', 'const',
    'def ', 'import ', 'public ',
    '<script', '<style', '<div',
    'SELECT ', 'INSERT ', 'UPDATE '
  ];
  
  return codePatterns.some(pattern => text.includes(pattern));
};