export const handleSecuritySuggestion = async (promptInput) => {
  console.log('handleSecuritySuggestion called with promptInput:', promptInput);

  // Critical patterns check
  const criticalPatterns = [
    /auth|login|password|credential|session/i,
    /data|privacy|encrypt|backup|store/i,
    /server|cloud|network|infrastructure|config/i,
    /website|webapp|frontend|backend|api|endpoint/i,
    /security|secure|protect|risk|threat/i
  ];

  // Quick check if any pattern matches
  const hasCriticalPattern = criticalPatterns.some((pattern) => pattern.test(promptInput));

  if (!hasCriticalPattern) {
    console.log('No security-relevant terms found.');
    return null;
  }

  console.log('Security-relevant terms found.');

  // Context-guiding prompt enhancement
  return `${promptInput}

Please include in your response:
1. Key security considerations
2. Essential security measures
3. Best practices relevant to this context

Focus on practical, actionable guidance while answering the original question.`;
};
