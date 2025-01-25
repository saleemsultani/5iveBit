import { fetchCVEByID } from './cveSearchAPI';
import { WrapperPrompt } from '../contexts/prompts';

export const handleCVEQuery = async (promptInput, updatedMessages, setcurrentChat) => {
  console.log('handleCVEQuery called with promptInput:', promptInput);

  // Check if the promptInput contains relevant terms
  const relevantTerms = /vulnerability|CVE|vuln/i;
  if (relevantTerms.test(promptInput)) {
    console.log('Relevant terms found in promptInput.');

    // Check if the promptInput contains a CVE-related query
    const cveMatch = promptInput.match(/CVE-\d{4}-\d{4,7}/i);
    let cveInfo = null;
    if (cveMatch) {
      console.log('CVE-related query found:', cveMatch[0]);
      const cveId = cveMatch[0];
      const cveData = await fetchCVEByID(cveId);

      // Extract only the important information from the response
      cveInfo = cveData
        ? {
            cveId: cveData.cveMetadata.cveId,
            description: cveData.containers.cna.descriptions[0]?.value,
            affectedProduct: cveData.containers.cna.affected[0]?.product,
            affectedVendor: cveData.containers.cna.affected[0]?.vendor,
            datePublished: cveData.cveMetadata.datePublished,
            references: cveData.containers.cna.references.map((ref) => ({
              name: ref.name,
              url: ref.url
            }))
          }
        : null;
    }

    // Prepare the content to be displayed
    const cveResponse = cveInfo
      ? `CVE ID: ${cveInfo.cveId}\n` +
        `Description: ${cveInfo.description}\n` +
        `Affected Product: ${cveInfo.affectedProduct}\n` +
        `Affected Vendor: ${cveInfo.affectedVendor}\n` +
        `Date Published: ${cveInfo.datePublished}\n` +
        `References:\n` +
        cveInfo.references.map((ref) => `- ${ref.name}: ${ref.url}`).join('\n')
      : '';

    // Combine the promptInput, CVE details, and WrapperPrompt
    const combinedMessage = `${WrapperPrompt}\n\n${promptInput}\n\n${cveResponse}`.trim();

    // Send request to the local LLM server
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: '5iveBit-ca-4',
        messages: [...updatedMessages, { role: 'user', content: combinedMessage }],
        stream: false
      })
    });

    console.log('Response received:', response);

    // Debug logging for API response
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    const text = await response.text();
    console.log('Raw response text:', text);

    let data;
    try {
      data = JSON.parse(text);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response');
    }

    if (!data.message || !data.message.content) {
      console.error('No message content in data:', data);
      throw new Error('No message content in data');
    }

    // Update chat with the AI's response
    setcurrentChat((current) => ({
      ...current,
      messages: [...updatedMessages, { role: 'assistant', content: data.message.content }]
    }));

    return data.message.content;
  } else {
    console.log('No relevant terms found in promptInput.');
    return null;
  }
};
