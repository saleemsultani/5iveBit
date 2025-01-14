import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Prism from 'prismjs';
import 'prismjs/themes/prism-funky.css'; //maybe change syntax theme
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
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

      // file extensions for different languages
      const languageMap = {  //update & add more if needed
        'javascript': 'javascript',
        'js': 'javascript',
        'jsx': 'jsx',
        'typescript': 'typescript',
        'ts': 'typescript',
        'python': 'python',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c++': 'cpp',
        'c'  : 'c',
        'cs': 'c#',
        'sql': 'sql',
        'html': 'html',
        'css': 'css',
        'bash': 'bash',
        'shell': 'bash',
        'json' : 'json',
        'xml'  : 'xml',
        'php'  : 'php',
        'rb'  : 'ruby',
        'asp.net' : 'aspx',
        'dart' : 'dart', 
        'ejs' : 'embedded javascript',
        'md' : 'markdown', 
        'yaml' : 'yaml', 
        'yml' : 'yml', 
        'htm' : 'html', 
        'mjs' : 'node js',
        'cjs' : 'node js',
        'sass' : 'stylesheet',
        'vue' : 'javascript',
        'tsx' : 'javascript', 
        'bson' : 'nosql' }

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