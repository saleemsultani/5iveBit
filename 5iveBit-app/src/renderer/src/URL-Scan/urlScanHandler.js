import { WrapperPrompt } from '../contexts/prompts';
import { scanURL, getAnalysisResults } from './urlScanAPI';
import { setShouldRenderSavePDF } from '../CVE/cveHandler';

export const handleURLScanQuery = async (
  promptInput,
  updatedMessages,
  setcurrentChat,
  updateCurrentChat
) => {
  console.log('handleURLScanQuery called with promptInput:', promptInput);

  // Check if the promptInput contains URL scan related terms
  const relevantTerms = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

  if (relevantTerms.test(promptInput)) {
    console.log('URL scan relevant terms found in promptInput.');

    // Extract URL from the prompt
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const urlMatch = promptInput.match(urlPattern);
    let urlInfo = null;

    if (urlMatch) {
      console.log('URL found in query:', urlMatch[0]);
      const url = urlMatch[0];

      try {
        const urlScanResponse = await scanURL(url);
        const analysisId = urlScanResponse.data.id;
        console.log('Analysis ID:', analysisId);

        // Get the analysis results using the ID
        const analysisResults = await getAnalysisResults(analysisId);
        console.log('Analysis Results:', analysisResults);

        // Extract relevant information
        const attributes = analysisResults?.data?.attributes;
        const stats = attributes?.stats || {};
        const results = attributes?.results || {};

        // Filter out noteworthy scan results (only keep non-harmless detections)
        const noteworthyResults = Object.values(results)
          .filter((engine) => engine.category !== 'harmless')
          .map((engine) => ({
            engine_name: engine.engine_name,
            category: engine.category,
            result: engine.result
          }));

        // Aggregate extracted information
        const aggregatedResults = {
          summary: {
            harmless: stats.harmless || 0,
            malicious: stats.malicious || 0,
            suspicious: stats.suspicious || 0,
            timeout: stats.timeout || 0,
            undetected: stats.undetected || 0
          },
          noteworthy_results: noteworthyResults
        };

        console.log('Aggregated Results:', aggregatedResults);

        // Assign the extracted results to urlInfo
        urlInfo = aggregatedResults;
      } catch (error) {
        console.error('Error scanning URL:', error);
        urlInfo = { error: 'Failed to scan URL. Please try again later.' };
      }
    }

    // Combine the scan results with WrapperPrompt
    const scanPrompt =
      'Present the following information in a report format. Avoid printing the JSON. Describe this information but do not say anything other than this information.';
    const combinedMessage =
      `${WrapperPrompt}\n\n${scanPrompt}\n\n${JSON.stringify(urlInfo, null, 2)}`.trim();
    console.log('Combined message:', combinedMessage);

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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response');
    }

    if (!data.message || !data.message.content) {
      throw new Error('No message content in data');
    }

    // Update chat with the AI's response
    setcurrentChat((current) => {
      const newChat = {
        ...current,
        messages: [...updatedMessages, { role: 'assistant', content: data.message.content }]
      };

      // save the changes done in currentChat in the DB
      // console.log('type of data.messages.content ', data.messages.content);
      updateCurrentChat({ chatId: newChat._id, messages: newChat.messages }); // Using the new state
      return newChat;
    });

    // Set shouldRenderSavePDF to true if certain conditions are met
    setShouldRenderSavePDF(true);

    return data.message.content;
  } else {
    console.log('No URL scan relevant terms found in promptInput.');
    return null;
  }
};
