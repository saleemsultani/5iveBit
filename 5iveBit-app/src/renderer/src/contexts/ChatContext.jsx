import { useState, createContext, useContext, useEffect } from "react";

const ChatsContext = createContext();

function generateRandomId(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function ChatsProvider({ children }) {
  const [question, setQuestion] = useState("");
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
