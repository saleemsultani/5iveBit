import { useState, createContext, useContext, useEffect } from 'react';

const ChatsContext = createContext();

function generateRandomId(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function ChatsProvider({ children }) {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setcurrentChat] = useState({
    id: generateRandomId(15),
    messages: [] // Ensure this is always initialized as an empty array
  });

  const addChat = function (newChat) {
    setChats((current) => {
      return [...current, { 
        id: generateRandomId(15), 
        messages: [], // Ensure new chats have messages array
        ...newChat 
      }];
    });
  };

  const updateChats = function () {
    const obj = chats.find((chat) => currentChat.id === chat.id);
    console.log(obj);
  };

  const generateAnswer = async (promptInput) => {
    try {
      // Get current messages and add new user message
      const currentMessages = [...(currentChat.messages || [])];
      const updatedMessages = [
        ...currentMessages,
        { role: "user", content: promptInput }
      ];

      // Update UI with thinking message
      setcurrentChat(current => ({
        ...current,
        messages: [
          ...updatedMessages,
          { role: "assistant", content: "Thinking..." }
        ]
      }));

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "5iveBit-ca-1",
          messages: updatedMessages, // Send full message history
          stream: false
        })
      });

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

      // Update the conversation with the real response
      setcurrentChat(current => ({
        ...current,
        messages: [
          ...updatedMessages,
          { role: "assistant", content: data.message.content }
        ]
      }));

      return data.message.content;
    } catch (error) {
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return 'Sorry, I encountered an error processing your request. If the issue persists, please contact support.';
    }
  };

  useEffect(() => {
    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((chat) => chat.id === currentChat.id);

      if (chatIndex === -1) {
        // If currentChat is not in chats, add it
        return [...prevChats, currentChat];
      } else {
        // If currentChat exists, update it
        return prevChats.map((chat, index) => (index === chatIndex ? currentChat : chat));
      }
    });
  }, [currentChat]);

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

function useChats() {
  const context = useContext(ChatsContext);
  return context;
}

export { ChatsProvider, useChats };
