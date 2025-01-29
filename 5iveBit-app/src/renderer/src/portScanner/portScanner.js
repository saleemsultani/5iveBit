import { WrapperPrompt } from '../contexts/prompts';

// Default port ranges
const PORT_RANGES = {
  MIN_PORT: 1024, // Start of registered ports
  MAX_PORT: 49151, // End of registered ports
  DEFAULT_SCAN_START: 3000,
  DEFAULT_SCAN_END: 4000,
  CHUNK_SIZE: 1000 // How many ports to scan at once
};

// Helper function to get port range from input
const getPortRange = (input) => {
  const rangeMatch = input.match(/port.*?(\d+).*?(\d+)/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    // Ensure ports are within safe range
    if (start >= PORT_RANGES.MIN_PORT && end <= PORT_RANGES.MAX_PORT && start < end) {
      return { start, end };
    }
  }
  return {
    start: PORT_RANGES.DEFAULT_SCAN_START,
    end: PORT_RANGES.DEFAULT_SCAN_END
  };
};

// Check the status of a single port
const checkPortStatus = (port, host = '127.0.0.1') => {
  return window.api.checkPortStatus(port, host);
};

// Find the first available port in the specified range
const findAvailablePort = (startPort, endPort, host = '127.0.0.1') => {
  return window.api.findAvailablePort(startPort, endPort, host);
};

// Find the first port in use in the specified range
const findInUsePort = (startPort, endPort, host = '127.0.0.1') => {
  return window.api.findInUsePort(startPort, endPort, host);
};

// Main function to handle port scan queries
export const handlePortScanQuery = async (promptInput, updatedMessages, setcurrentChat) => {
  console.log('handlePortScanQuery called with promptInput:', promptInput);

  // Check if the promptInput contains relevant terms for port scanning
  const relevantTerms = /(port|open|scan|check)/i;
  if (relevantTerms.test(promptInput)) {
    console.log('Relevant terms found in promptInput for port scanning.');

    // Check if the promptInput contains specific port-related query
    const portMatch = promptInput.match(/(\d{1,5})/); // Match port numbers
    let portResponse = null;

    if (portMatch) {
      const port = parseInt(portMatch[0]);

      // Check if the port is open
      try {
        const status = await checkPortStatus(port);
        portResponse = `Port ${port} is currently ${status}.`;
      } catch (error) {
        portResponse = `Error checking port ${port}: ${error.message}`;
      }
    }

    // Look for queries requesting available ports
    const availablePortMatch = promptInput.match(/find (available|open) port/i);
    let availablePortResponse = null;

    if (availablePortMatch) {
      try {
        const { start, end } = getPortRange(promptInput);
        const availablePort = await findAvailablePort(start, end);
        availablePortResponse = `The first available port between ${start} and ${end} is: ${availablePort}.`;
      } catch (error) {
        availablePortResponse = `Error finding available port: ${error.message}`;
      }
    }

    // Look for queries requesting in-use ports
    const inUsePortMatch = promptInput.match(/find (in use|blocked) port/i);
    let inUsePortResponse = null;

    if (inUsePortMatch) {
      try {
        const { start, end } = getPortRange(promptInput);
        const result = await findInUsePort(start, end);
        if (result && result.error) {
          inUsePortResponse = `${result.error} You might want to try a different port range or check if any applications are running on these ports.`;
        } else {
          inUsePortResponse = `The first in-use port between ${start} and ${end} is: ${result}.`;
        }
      } catch (error) {
        inUsePortResponse = `Port scanning completed: No ports were found to be in use between ${start} and ${end}. This could mean all ports in this range are available, or the applications using these ports are not detectable.`;
      }
    }

    // Set default values if responses are empty
    const finalPortResponse = portResponse || '';
    const finalPortAvailableResponse = availablePortResponse || '';
    const finalPortInUseResponse = inUsePortResponse || '';

    // Add a prompt if there's any port information
    const hasPortInfo = finalPortResponse || finalPortAvailableResponse || finalPortInUseResponse;
    const introText = hasPortInfo ? 'Port Scanning finished. Here are the results:\n\n' : '';

    // Combine only non-empty responses
    const responses = [finalPortResponse, finalPortAvailableResponse, finalPortInUseResponse]
      .filter((response) => response) // Filter out empty responses
      .join('\n\n'); // Join only non-empty responses with double newlines

    const combinedMessage = `${WrapperPrompt}\n\n${introText}${responses}`.trim();

    console.log('Combined port scan message:', combinedMessage);

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
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response');
    }

    if (!data.message || !data.message.content) {
      console.error('No message content in data:', data);
      throw new Error('No message content in data');
    }

    setcurrentChat((current) => ({
      ...current,
      messages: [...updatedMessages, { role: 'assistant', content: data.message.content }]
    }));

    return data.message.content;
  } else {
    console.log('No relevant terms found in promptInput for port scanning.');
    return null;
  }
};
