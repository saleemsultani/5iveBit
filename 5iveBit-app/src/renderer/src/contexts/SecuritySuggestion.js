import { WrapperPrompt } from './prompts';

export const generateSecuritySuggestions = async (userInput, messages, setCurrentChat) => {
  // Check if the user's input contains relevant keywords
  const keywords = ['secure', 'security', 'harden', 'protect', 'vulnerability'];
  const hasSecurityKeyword = keywords.some((keyword) => userInput.toLowerCase().includes(keyword));

  if (hasSecurityKeyword) {
    // Generate follow-up questions and prompts based on user's input
    const followUpQuestions = [
      'What is the purpose and scope of your application?',
      'What technologies, frameworks, or libraries are you using?',
      'Are there any specific security concerns or requirements you have?',
      'Will your application handle sensitive user data? If so, what kind of data?',
      'Are you planning to deploy your application on-premises or in the cloud?',
      'Do you have any existing security measures or policies in place?'
    ];

    const securityPrompts = [
      "Provide general security best practices and guidelines relevant to the application's purpose and scope.",
      'Discuss secure coding practices and common vulnerabilities to avoid in the mentioned technologies.',
      'Suggest appropriate security measures and controls based on the identified security concerns and requirements.',
      'Highlight data protection regulations and best practices for handling sensitive user data.',
      'Recommend security considerations and best practices for the chosen deployment environment.',
      'Discuss the importance of security policies, access controls, and monitoring in the context of the application.'
    ];

    // Check for latest updates and CVEs
    const updatesPrompt =
      'Check for any recent security updates or patches related to the technologies mentioned.';
    const cvePrompt =
      'Provide information on any relevant CVEs (Common Vulnerabilities and Exposures) associated with the technologies discussed.';

    // Combine the user's input, follow-up questions, security prompts, updates prompt, CVE prompt, and WrapperPrompt
    const securityPrompt = `${WrapperPrompt}

User's input:
${userInput}

Follow-up questions:
${followUpQuestions.join('\n')}

Security prompts:
${securityPrompts.join('\n')}

Updates and CVEs:  
${updatesPrompt}
${cvePrompt}

Please provide comprehensive security suggestions and best practices based on the user's input, follow-up questions, security prompts, and updates/CVEs. Tailor the response to the user's specific context and needs, covering a broad range of security aspects relevant to their application.`;

    // Send the security prompt to the AI
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: '5iveBit-ca-1',
        messages: [...messages, { role: 'user', content: securityPrompt }],
        stream: false
      })
    });

    const data = await response.json();

    if (data.message && data.message.content) {
      // Update the chat with the AI's security suggestions
      setCurrentChat((current) => ({
        ...current,
        messages: [...messages, { role: 'assistant', content: data.message.content }]
      }));
    }
  }
};
