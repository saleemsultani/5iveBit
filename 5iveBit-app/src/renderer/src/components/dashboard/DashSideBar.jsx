import { useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './DashSideBar.module.css';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import { AboutModal, HelpModal } from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

function DashSideBarButton({ children, buttonText, onClick }) {
  return (
    <Button className={styles.dashSideBarButton} variant="outlined" onClick={onClick}>
      {buttonText}
      {children}
    </Button>
  );
}

function DashSideBar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

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
            onClick={() => {
              navigate('/user-profile');
            }}
          >
            {auth?.user ? auth.user?.firstName : 'PROFILE'}
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
