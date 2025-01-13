//helps with detecting code in chat

export const isLikelyCode = (text) => {
  const codePatterns = [

    //Syntax elements    //update if needed
    '{', '}', ';', '//', '/*', 
    
    //Programming keywords
    'function', 'class', 'const', 'let',
    'import', 'export', 'return',
    
    // React/Web
    '<div', '<span', 'useState',
    'className', 'export default',
    
    // Python 
    'def ', 'print(', 'class ',
    
    //SQL
    'SELECT ', 'INSERT ', 'UPDATE ',
    
    // Programming constructs
    'if(', 'for(', 'while('
  ];
  
  return codePatterns.some(pattern => text.includes(pattern));
};