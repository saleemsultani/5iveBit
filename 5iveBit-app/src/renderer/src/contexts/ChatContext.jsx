import { useState, createContext, useContext, useEffect } from 'react';
import { fetchCVEByID } from '../CVE/cveSearchAPI';
const ChatsContext = createContext();

// Utility function to generate unique IDs for chats and messages
function generateRandomId(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Provider component that wraps the app and manages chat-related state
function ChatsProvider({ children }) {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setcurrentChat] = useState({
    id: generateRandomId(15),
    messages: []
  });

  // Creates a new chat session with a unique ID
  const addChat = function (newChat) {
    setChats((current) => {
      return [
        ...current,
        {
          id: generateRandomId(15),
          messages: [],
          ...newChat
        }
      ];
    });
  };

  // Updates the chats array when the current chat changes
  const updateChats = function () {
    const obj = chats.find((chat) => currentChat.id === chat.id);
    console.log(obj);
  };

  // Handles the API communication with the local LLM server
  const generateAnswer = async (promptInput) => {
    try {
      // Add user message to the current chat
      const currentMessages = [...(currentChat.messages || [])];
      const updatedMessages = [...currentMessages, { role: 'user', content: promptInput }];

      // Show a temporary "Thinking..." message while waiting for response
      setcurrentChat((current) => ({
        ...current,
        messages: [
          ...updatedMessages,
          { role: 'assistant', content: 'Thinking...', isThinking: true }
        ]
      }));

      // Add WrapperPrompt to every promptInput
      const WrapperPrompt =
        'You are a cybersecurity expert. Please be polite with each interaction. Do not hallucinate or make up information.';

      // Check if the promptInput contains relevant terms
      const relevantTerms = /vulnerability|CVE|vuln/i;
      if (relevantTerms.test(promptInput)) {
        // Check if the promptInput contains a CVE-related query
        const cveMatch = promptInput.match(/CVE-\d{4}-\d{4,7}/i);
        let cveInfo = null;
        if (cveMatch) {
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
            model: '5iveBit-ca-1',
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
        // If no relevant terms, send the promptInput with WrapperPrompt
        const combinedMessage = `${WrapperPrompt}\n\n${promptInput}`.trim();

        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: '5iveBit-ca-1',
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
      }
    } catch (error) {
      // Detailed error logging for debugging
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return 'Sorry, I encountered an error processing your request. If the issue persists, please contact support.';
    }
  };

  // Effect hook to sync currentChat with the chats array
  useEffect(() => {
    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((chat) => chat.id === currentChat.id);

      if (chatIndex === -1) {
        return [...prevChats, currentChat];
      } else {
        return prevChats.map((chat, index) => (index === chatIndex ? currentChat : chat));
      }
    });
  }, [currentChat]);

  // Provide chat-related state and functions to child components
  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChats,
        currentChat,
        setcurrentChat,
        addChat,
        updateChats,
        generateRandomId,
        question,
        setQuestion,
        generateAnswer
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

// Custom hook for accessing chat context in components
function useChats() {
  const context = useContext(ChatsContext);
  return context;
}

export { ChatsProvider, useChats };
