import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Snackbar } from '@mui/material';
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
  const { chats, setcurrentChat, setQuestion, currentLevel, setCurrentLevel } = useChats();
  const [openLevelSelect, setOpenLevelSelect] = useState(false);
  //const [currentLevel, setCurrentLevel] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(false);

  const userExperienceLevels = ['beginner', 'intermediate', 'expert'];

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

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
    setOpenLevelSelect(false);
    
    setSnackbarMessage(true);
    console.log('Experience level changed to:', level);
    
    setTimeout(() => {
      setSnackbarMessage(false);
    }, 3000);
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

          {/* Chat History Button */}
        <RightbarButton onClick={() => setOpenHistory(!openHistory)} sx={{ position: 'relative' }} >
          <span>Chat History</span>
          {openHistory ? (
            <KeyboardArrowUpIcon
              sx={{
                position: 'absolute',
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '1.5rem', 
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                position: 'absolute',
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '1.5rem', 
              }}
            />
          )}
        </RightbarButton>

          {/* Chat History Dropdown */}
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
        <RightbarButton onClick={() => setOpenLevelSelect(!openLevelSelect)} sx={{ position: 'relative' }}>
          <span>Experience Level</span>
          {openLevelSelect ? (
            <KeyboardArrowUpIcon
              sx={{
                position: 'absolute',
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '1.5rem', 
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                position: 'absolute',
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '1.5rem', 
              }}
            />
          )}
        </RightbarButton>

          {/* User Experience Level Dropdown */}
          <Box className={`${styles.userLevel} ${openLevelSelect ? styles.open : ''}`}>
            {userExperienceLevels.map((level) => (
              <Button
                key={level}
                className={styles.experienceLevelButton}
                onClick={() => handleLevelChange(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </Box>
        </Box>

        <Snackbar
        open={snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(false)}
        message={`Experience level set to ${currentLevel ? currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1) : 'Default'}`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
        {/* Bottom Button */}
        <RightbarButton buttonText="Support" onClick={handleSupport} />
      </Box>
    </Box>
  );
}

export default RightBar;
