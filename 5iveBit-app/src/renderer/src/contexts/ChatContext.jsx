import React, { useState, createContext, useContext, useEffect } from 'react';

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
  const [currChat, setCurrChat] = useState({
    id: generateRandomId(15),
    questions: [],
    answers: []
  });

  const addChat = function (newChat) {
    setChats((curr) => {
      return [...curr, { id: generateRandomId(15), ...newChat }];
    });
  };

  const updateChats = function (id) {
    const obj = chats.find((chat) => currChat.id === chat.id);
    console.log(obj);
  };

  useEffect(() => {
    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((chat) => chat.id === currChat.id);

      if (chatIndex === -1) {
        // If currChat is not in chats, add it
        return [...prevChats, currChat];
      } else {
        // If currChat exists, update it
        return prevChats.map((chat, index) => (index === chatIndex ? currChat : chat));
      }
    });
  }, [currChat]);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChats,
        currChat,
        setCurrChat,
        addChat,
        updateChats,
        generateRandomId,
        question,
        setQuestion
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
