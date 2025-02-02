import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';
import styles from './DashSideBar.module.css';
import PersonIcon from '@mui/icons-material/Person';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import { AboutModal, HelpModal } from '../shared/Modal';

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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleNewChat = () => {
    setcurrentChat({
      id: generateRandomId(),
      questions: [],
      answers: []
    });
    setQuestion('');
  };

  const handleSetcurrentChat = (id) => {
    {
      /*FIX*/
    }
    setcurrentChat(chats.find((chat) => chat.id === id));
  };

  return (
    <Box className={styles.dashSideBarContainer} sx={{ overflowX: 'hidden' }}>
      <Box className={styles.dashSideBarContent}>
        {/* Top Buttons */}
        <Box className={styles.topSection}>
          {/* User Profile Button */}
          <Button
            className={styles.userProfileButton}
            variant="outlined"
            startIcon={<PersonIcon className={styles.profileIcon} />}
            sx={{ color: 'white' }}
          >
            Profile
          </Button>
          <DashSideBarButton buttonText="Reports" />
        </Box>
      </Box>

      {/* Lower Links */}
      <Box className={styles.lowerLinks}>
        <a
          href="#"
          className={styles.lowerLink}
          onClick={(e) => {
            e.preventDefault();
            setIsHelpOpen(true);
          }}
        >
          <HelpOutlineIcon /> Help
        </a>
        <a
          href="#"
          className={styles.lowerLink}
          onClick={(e) => {
            e.preventDefault();
            setIsAboutOpen(true);
          }}
        >
          <InfoIcon /> About
        </a>

        {/* Modal Components */}
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </Box>
    </Box>
  );
}

export default DashSideBar;
