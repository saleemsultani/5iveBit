import { useState, createContext, useContext, useEffect } from 'react';
import { WrapperPrompt } from './prompts';
import { beginnerPrompt, intermediatePrompt, expertPrompt } from './UserLevelPrompts';
import { handleCVEQuery } from '../CVE/cveHandler';
import { handlePortScanQuery } from '../portScanner/portScanner';
import { handleSecuritySuggestion } from './SecuritySuggestion';
import { handleURLScanQuery } from '../URL-Scan/urlScanHandler';
import { useAuth } from './authContext';
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
  const [currentLevel, setCurrentLevel] = useState(null);
  const [auth, setAuth] = useAuth();
  const [currentChat, setcurrentChat] = useState({
    id: generateRandomId(15),
    messages: []
  });

  // for initial loading of chats and current chat
  useEffect(() => {
    // if user is not logged in don't initiate chat
    if (!auth?.user) {
      console.log('user not logged in so chat not inieiated');
      return;
    }
    async function fetchChats() {
      try {
        const allChats = await window.api.getAllChats();
        console.log(allChats);
        const parsedChats = JSON.parse(allChats.chats);
        console.log(parsedChats);
        // check if there is no chat
        if (parsedChats.length === 0) {
          console.log('there is no chat: creating chat...');
          // create a new chat
          const newChat = await window.api.createChat({ messages: [] });
          console.log('this is initial chat', newChat);
          if (newChat.success) {
            setcurrentChat({
              _id: newChat.chatId,
              messages: JSON.parse(newChat.messages)
            });
          }
        } else {
          console.log('this is parsedChat[0] inside useEffect: ', parsedChats[0]);
          setcurrentChat(parsedChats[0]);
          setChats(parsedChats);
        }
      } catch (error) {
        console.log('error', error);
      }
    }

    fetchChats();
  }, [auth]);

  // update chats state with all the chats from database
  const updateChats = async function () {
    try {
      const res = await window.api.getAllChats();
      const parsedChats = JSON.parse(res.chats);
      if (res.success) {
        setChats(parsedChats);
      } else {
        console.log('error updating chats');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // updates current chat from the dataBase
  // chat data is object which has id and messages array
  const updateCurrentChat = async function (chatData) {
    console.log(chatData);
    const res = await window.api.updateChat(chatData);
    console.log(res);
    const parsedMessages = JSON.parse(res.messages);
    try {
      if (res.success) {
        setcurrentChat({
          _id: res.chatId,
          messages: parsedMessages
        });
      }
    } catch (error) {
      console.log('error', error);
    }
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

      // Use the new handleCVEQuery function
      const cveResponse = await handleCVEQuery(promptInput, updatedMessages, setcurrentChat);
      if (cveResponse !== null) {
        return cveResponse;
      }

      const URLScanResponse = await handleURLScanQuery(
        promptInput,
        updatedMessages,
        setcurrentChat
      );
      if (URLScanResponse !== null) {
        return URLScanResponse;
      }

      // Use the new handlePortScanQuery function
      const portScanResponse = await handlePortScanQuery(
        promptInput,
        updatedMessages,
        setcurrentChat
      );
      if (portScanResponse !== null) {
        return portScanResponse;
      }
      let finalPrompt = promptInput;
      try {
        // Get security-enhanced prompt if applicable
        const enhancedPrompt = await handleSecuritySuggestion(promptInput);
        if (enhancedPrompt) {
          console.log('Using security-enhanced prompt');
          finalPrompt = enhancedPrompt;
        }
      } catch (error) {
        console.error('Error in security suggestion handler:', error);
      }
      //Prompt Levels
      let levelPrompt = '';
      if (currentLevel === 'beginner') {
        levelPrompt = beginnerPrompt;
      } else if (currentLevel === 'intermediate') {
        levelPrompt = intermediatePrompt;
      } else if (currentLevel === 'expert') {
        levelPrompt = expertPrompt;
      }

      // If no relevant terms, send the promptInput with WrapperPrompt if user selects experience level send that with the wrapper prompt
      const combinedMessage = currentLevel
        ? `${WrapperPrompt}\n\n${levelPrompt}\n\n${finalPrompt}`.trim()
        : `${WrapperPrompt}\n\n${finalPrompt}`.trim();

      console.log('Current level:', currentLevel);

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
      setcurrentChat((current) => {
        const newChat = {
          ...current,
          messages: [...updatedMessages, { role: 'assistant', content: data.message.content }]
        };

        // save the changes done in currentChat in the DB
        updateCurrentChat({ chatId: newChat._id, messages: newChat.messages }); // Using the new state
        return newChat;
      });

      return data.message.content;
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
        updateChats,
        generateRandomId,
        question,
        setQuestion,
        generateAnswer,
        currentLevel,
        setCurrentLevel
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
