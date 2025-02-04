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

  const handleSurveyClick = () => {
    const subject = encodeURIComponent(" Quick Feedback on 5iveBot App");
    const body = encodeURIComponent(
      `Hi there!

      Thank you for using 5iveBit! Your feedback is incredibly valuable to us as we work to improve our cybersecurity app and ensure it meets your needs. Could you spare a few minutes to answer these quick questions?

      1. On a scale of 1 to 5, how would you rate your overall experience with 5iveBit?  
        (1 = Not great, 5 = Amazing!)

      2. What’s the most useful feature of the app for you?

      3. Is there anything about the app that feels confusing or could be improved?

      4. How secure do you feel when using 5iveBit?  
        (1 = Not secure at all, 5 = Extremely secure)

      5. Has 5iveBit helped you prevent or stop any cyber attacks?

      6. Do you feel the app has improved your understanding of cybersecurity?

      7. Has 5iveBit helped your SME improve its cybersecurity posture?

      8. Are there any features you’d like to see added to the app?

      9. Are you enjoying our newsletter? (If applicable)

      10. Any additional feedback or suggestions? We’d love to hear them!

      Thank you so much for helping us make 5iveBit even better. Your input ensures we can continue keeping your data safe and secure!

      Best regards,  

      The 5iveBit Team`
        );

  window.location.href = `mailto:contact.5iveBit@gmail.com?subject=${subject}&body=${body}`;
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
            onClick={() => {
              navigate('/user-profile');
            }}
          >
            {auth?.user ? auth.user?.firstName : 'PROFILE'}
          </Button>
          {/* Survey Button */}
          <DashSideBarButton buttonText="Take Survey" onClick={handleSurveyClick} />
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
