import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

// Base Modal component for creating consistent modal dialogs
const BaseModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Box className={styles.modalOverlay} onClick={onClose}>
      <Box className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <IconButton onClick={onClose} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Box>
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

// About modal displays company information and website link
export const AboutModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Box className={styles.contentContainer}>
        <Typography variant="h4" className={styles.modalTitle}>
          About
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          Who We Are
        </Typography>
        <Typography className={styles.sectionText}>
          5iveBit is at the forefront of the AI revolution, committed to leveraging the power of
          artificial intelligence in transforming industries and uplifting human capabilities.
          Founded with a vision to make cybersecurity accessible and intelligent, we bring together
          cutting-edge AI technology with practical security solutions.
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          Our Mission
        </Typography>
        <Typography className={styles.sectionText}>
          We aim to develop breakthrough AI solutions that solve real-world challenges. Our mission
          is to empower the digital world with AI-powered cybersecurity to anticipate, adapt, and
          defend.
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          What We Do
        </Typography>
        <Typography className={styles.sectionText}>
          We design and provide artificial intelligence-powered cybersecurity assessment tools to
          identify vulnerabilities and detect threats to ensure your digital assets are protected.
          Our platform, 5iveBot, puts natural language processing together with deep security
          expertise to provide intelligent security guidance with context-aware analysis.
        </Typography>

        <Box className={styles.buttonWrapper}>
          <button
            onClick={() => window.open('https://5ivebit.vercel.app/', '_blank')}
            className={styles.actionButton}
          >
            Visit Our Website
          </button>
        </Box>
      </Box>
    </BaseModal>
  );
};

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

// Help modal provides application usage information and support contact
export const HelpModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Box className={styles.contentContainer}>
        <Typography variant="h4" className={styles.modalTitle}>
          Help
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          Getting Started
        </Typography>
        <Typography className={styles.sectionText}>
          Our application provides real-time cybersecurity analysis and support. Select your
          experience level (beginner, intermediate, or expert) to receive tailored responses. This
          personalization ensures you get the most relevant and actionable security guidance for
          your skill level.
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          Features
        </Typography>
        <ul className={styles.featuresList}>
          <li>Chat with our AI to get cybersecurity advice and recommendations</li>
          <li>Upload files for comprehensive security analysis</li>
          <li>Access the latest CVE information and vulnerability updates</li>
          <li>Perform port scanning to identify security risks</li>
          <li>Download chat logs for documentation and future reference</li>
          <li>Receive experience level-specific security guidance</li>
        </ul>

        <Typography variant="h6" className={styles.sectionTitle}>
          Need Additional Help?
        </Typography>
        <Typography className={styles.sectionText}>
          Our support team is ready to assist you with any questions or concerns you may have about
          using 5iveBot. Whether you need technical assistance or have questions about our features,
          we&apos;re here to help.
        </Typography>

        <Box className={styles.buttonWrapper}>
          <button
            onClick={() => (window.location.href = 'mailto:contact.5iveBit@gmail.com')}
            className={styles.actionButton}
          >
            Contact Support
          </button>
        </Box>
      </Box>
    </BaseModal>
  );
};

HelpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default { AboutModal, HelpModal };
