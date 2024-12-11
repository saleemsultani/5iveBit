import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Button, IconButton } from "@mui/material";
import { useChats } from "./contexts/ChatContext.jsx";

function generateRandomId(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function RightbarButton({ children, buttonText, onClick }) {
  return (
    <Button
      sx={{
        borderRadius: "10px",
        color: "white",
        padding: "10px",
        background: "linear-gradient(to right, #862e9c, #c10281)",
      }}
      variant="outlined"
      onClick={onClick}
    >
      {buttonText}
      {children}
    </Button>
  );
}

function RightBar() {
  const [openHistory, setOpenHistory] = useState(false);
  const {
    chats,
    currChat,
    setCurrChat,
    addChat,
    generateRandomId,
    setQuestion,
  } = useChats();

  const handleNewChat = function () {
    setCurrChat({
      id: generateRandomId(),
      questions: [],
      answers: [],
    });
    setQuestion("");
  };

  const handleSetCurrChat = function (id) {
    setCurrChat(chats.find((chat) => chat.id === id));
  };

  return (
    <Box flex={20}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <RightbarButton buttonText="New Chat" onClick={handleNewChat} />
          <RightbarButton buttonText="Reports" />

          <RightbarButton
            onClick={() => setOpenHistory(!openHistory)}
            buttonText="Chat History"
          >
            {openHistory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </RightbarButton>
          <Box
            sx={{
              display: openHistory ? "flex" : "none",
              flexDirection: "column",
              gap: "1",
              color: "white",
              alignItems: "center",
              height: "100px",
              overflowY: "scroll",
            }}
          >
            {chats.map((c, i) => (
              <Button
                key={c.id}
                sx={{
                  padding: 0,
                  margin: 0,
                  width: "70%",
                  border: "solid,white,1px",
                }}
                onClick={() => handleSetCurrChat(c.id)}
              >
                {`chat ${i + 1}`}
              </Button>
            ))}
          </Box>
        </Box>
        <RightbarButton buttonText="Support" />
      </Box>
    </Box>
  );
}

export default RightBar;
