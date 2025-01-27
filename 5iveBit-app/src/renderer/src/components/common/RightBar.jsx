import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';
import styles from './RightBar.module.css';

function generateRandomId(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
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
  const { chats, setcurrentChat, setQuestion } = useChats();
  const [openLevelSelect, setOpenLevelSelect] = useState(false);
  
  const userExperienceLevels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'expert', label: 'Expert' }
];

  const handleNewChat = () => {
    setcurrentChat({
      id: generateRandomId(),
      questions: [],
      answers: []
    });
    setQuestion('');
  };

  const handleSetcurrentChat = (id) => {
    setcurrentChat(chats.find((chat) => chat.id === id));
  };

  const handleLevelChange = (levelId) => {
    setOpenLevelSelect(false); 
};

  const handleSupport = () => {
    window.location.href = 'mailto:contact.5iveBit@gmail.com';
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
          <Box className={`${styles.chatHistory} ${openHistory ? styles.open : ''}`}>
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

        {/* User Experience Level Button */}
          <RightbarButton 
            onClick={() => setOpenLevelSelect(!openLevelSelect)} 
            buttonText="Experience Level"
          >
            {openLevelSelect ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </RightbarButton>

          {/* User Experience Level Dropdown */}
          <Box className={`${styles.userLevel} ${openLevelSelect ? styles.open : ''}`}>
            {userExperienceLevels.map((level) => (
              <Button
                key={level.id}
                className={styles.experienceLevelButton}
                onClick={() => handleLevelChange(level.id)}
              >
                {level.label}
              </Button>
            ))}
          </Box>
        </Box>
      
        {/* Bottom Button */}
        <RightbarButton buttonText="Support" onClick={handleSupport} />
      </Box>
    </Box>
  );
}

export default RightBar;
