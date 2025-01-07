import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';
import styles from './DashSideBar.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';

function generateRandomId(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function DashSideBarButton({ children, buttonText, onClick }) {
 return (
  <Button className={styles.dashSideBarButton} variant="outlined" onClick={onClick}>
    {buttonText}
    {children}
  </Button>
  );
}

function DashSideBar() {
 const [openHistory, setOpenHistory] = useState(false);
 const { chats, setcurrentChat, setQuestion } = useChats();

 const handleNewChat = () => {
  setcurrentChat({
  id: generateRandomId(),
  questions: [],
  answers: []
  });
 setQuestion('');
 };

  const handleSetcurrentChat = (id) => { {/*FIX*/}
   setcurrentChat(chats.find((chat) => chat.id === id));
 };

  return (
    <Box className={styles.dashSideBarContainer}>
     <Box className={styles.dashSideBarContent}>
      {/* Top Buttons */}
        <Box className={styles.topSection}>
           <DashSideBarButton buttonText="New Chat" onClick={handleNewChat} className='newChatButton'/> {/*change to route to chat bot*/}
           <DashSideBarButton buttonText="Reports" />
           <DashSideBarButton buttonText="Chat History" onClick={() => setOpenHistory(!openHistory)}>
           {openHistory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
           </DashSideBarButton>
        </Box>
     </Box>

  {/* Lower Links */}
    <Box className={styles.lowerLinks}>
      <a href="#" className={styles.lowerLink}>
        <ColorLensIcon /> Themes
      </a>
      <a href="#" className={styles.lowerLink}>
       <HelpOutlineIcon /> Help
     </a>
     <a href="#" className={styles.lowerLink}>
        <InfoIcon /> About
      </a>
    </Box> 

  {/* User Profile Button */}
  <Box className={styles.userProfileContainer}>
    <Button 
      className={styles.userProfileButton} 
      variant="outlined" 
      startIcon={<AccountCircleIcon className={styles.profileIcon}/>}
      sx={{color: 'white'}}
    >
  Profile
     </Button>
    </Box>
  </Box>
  );
}

export default DashSideBar;