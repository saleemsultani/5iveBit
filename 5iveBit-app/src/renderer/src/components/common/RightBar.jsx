import { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, IconButton, Snackbar, Tooltip } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';
import styles from './RightBar.module.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function RightbarButton({ children, buttonText, onClick }) {
  return (
    <Button className={styles.rightbarButton} variant="outlined" onClick={onClick}>
      {buttonText}
      {children}
    </Button>
  );
}

// RightBar Component is the side bar of the chat interface
function RightBar() {
  const [openHistory, setOpenHistory] = useState(false);
  const {
    chats,
    setChats,
    updateChats,
    currentChat,
    setcurrentChat,
    setQuestion,
    currentLevel,
    setCurrentLevel,
    handleNewChat
  } = useChats();
  const [openLevelSelect, setOpenLevelSelect] = useState(false);
  //const [currentLevel, setCurrentLevel] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(false);

  const userExperienceLevels = ['beginner', 'intermediate', 'expert'];

  // handle set current chat
  const handleSetcurrentChat = (id) => {
    const foundChat = chats.find((chat) => chat._id === id);
    console.log(id);
    // console.log(foundChat);
    setcurrentChat(foundChat);
  };

  const handleDeleteChat = async (id) => {
    if (!id) return; // Prevent deleting an invalid chat

    const res = await window.api.deleteChat(id);

    if (res.success) {
      console.log('Chat deleted successfully');

      // Fetch updated chats immediately
      const res = await window.api.getAllChats();
      const parsedChats = JSON.parse(res?.chats);
      setChats(parsedChats); // Update the chats list
      console.log(parsedChats);
      console.log(id, '  ===  ', currentChat?._id);
      if (parsedChats.length === 0) {
        setcurrentChat({}); // No chats left
      } else if (parsedChats.length === 1) {
        setcurrentChat(parsedChats[0]); // Only one chat remains
      } else if (currentChat?._id === id) {
        setcurrentChat(parsedChats[parsedChats.length - 1]); // Deleted chat was current, set to last chat
      }
      // Else case: If currentChat is not the deleted chat, do nothing (it remains unchanged)
    } else {
      console.error('Failed to delete chat');
    }
  };

  // Handle the user level change
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

          {/* Chat History Button */}
          <RightbarButton
            onClick={() => setOpenHistory(!openHistory)}
            sx={{ position: 'relative' }}
          >
            <span>Chat History</span>
            {openHistory ? (
              <KeyboardArrowUpIcon
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.5rem'
                }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.5rem'
                }}
              />
            )}
          </RightbarButton>

          {/* Chat History Dropdown */}
          {/* <Box className={`${styles.chatHistory} ${openHistory ? styles.open : ''}`}>
            {chats?.map((c, i) => (
              <Button
                key={c.id}
                className={styles.chatHistoryButton}
                onClick={() => handleSetcurrentChat(c._id)}
              >
                {`Chat ${i + 1}`}
                <DeleteChat />
              </Button>
            ))}
          </Box> */}
          <Box className={`${styles.chatHistory} ${openHistory ? styles.open : ''}`}>
            {chats?.map((c, i) => (
              <Box key={c.id} className={styles.chatItemContainer}>
                <Button
                  className={styles.chatHistoryButton}
                  onClick={() => handleSetcurrentChat(c._id)}
                >
                  {`Chat ${i + 1}`}
                </Button>
                <Tooltip title="Delete" placement="bottom-end">
                  <IconButton className={styles.deleteIcon} onClick={() => handleDeleteChat(c._id)}>
                    <DeleteOutlineIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>

          {/* User Experience Level Button */}
          <RightbarButton
            onClick={() => setOpenLevelSelect(!openLevelSelect)}
            sx={{ position: 'relative' }}
          >
            <span>Experience Level</span>
            {openLevelSelect ? (
              <KeyboardArrowUpIcon
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.5rem'
                }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.5rem'
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
