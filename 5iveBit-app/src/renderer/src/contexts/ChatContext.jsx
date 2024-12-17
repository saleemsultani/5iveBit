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
    questions: [],
    answers: []
  });

  const addChat = function (newChat) {
    setChats((current) => {
      return [...current, { id: generateRandomId(15), ...newChat }];
    });
  };

  const updateChats = function () {
    const obj = chats.find((chat) => currentChat.id === chat.id);
    console.log(obj);
  };

  const generateAnswer = async (promptInput) => {
    try {
      console.log('Making API request with prompt:', promptInput);
      console.log('Request body:', JSON.stringify({
        model: "llama3.2",
        prompt: promptInput,
        stream: false
      }, null, 2));

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: promptInput,
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

      if (!data.response) {
        console.error('No response field in data:', data);
        throw new Error('No response field in data');
      }

      return data.response;
    } catch (error) {
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return 'Sorry, I encountered an error processing your request.';
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
