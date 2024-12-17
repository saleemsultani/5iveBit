import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Button } from "@mui/material";
import { useChats } from "../../contexts/ChatContext";
import styles from "./RightBar.module.css";

function generateRandomId(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function RightbarButton({ children, buttonText, onClick }) {
  return (
    <Button className={styles.rightbarButton} variant="outlined" onClick={onClick}>
      {buttonText}
      {children}
    </Button>
  );
}

function RightBar() {
  const [openHistory, setOpenHistory] = useState(false);
  const { chats, currentChat, setcurrentChat, setQuestion } = useChats();

  const handleNewChat = () => {
    setcurrentChat({
      id: generateRandomId(),
      questions: [],
      answers: []
    });
    setQuestion("");
  };

  const handleSetcurrentChat = (id) => {
    setcurrentChat(chats.find((chat) => chat.id === id));
  };

  return (
    <Box className={styles.rightBarContainer}>
      <Box className={styles.rightBarContent}>
        {/* Top Buttons */}
        <Box className={styles.topSection}>
          <RightbarButton buttonText="New Chat" onClick={handleNewChat} />
          <RightbarButton buttonText="Reports" />
          <RightbarButton onClick={() => setOpenHistory(!openHistory)} buttonText="Chat History">
            {openHistory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </RightbarButton>

          {/* Chat History */}
          <Box className={`${styles.chatHistory} ${openHistory ? styles.open : ""}`}>
            {chats.map((c, i) => (
              <Button
                key={c.id}
                className={styles.chatHistoryButton}
                onClick={() => handleSetcurrentChat(c.id)}
              >
                {`Chat ${i + 1}`}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Bottom Button */}
        <RightbarButton buttonText="Support" />
      </Box>
    </Box>
  );
}

export default RightBar;
