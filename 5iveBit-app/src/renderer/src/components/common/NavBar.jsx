import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './NavBar.module.css';
import Logo from '../../assets/5iveBitLogo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

function NavBar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  return (
    <Box className={styles.navbarContainer}>
      <Box className={styles.navbarContent}>
        {/* Left Side Links */}
        <Box className={styles.navbarLinks}>
          <ArrowBackIcon className={styles.backArrow} onClick={() => navigate('/dashboard')} />
          <a href="https://5ivebit.vercel.app" target="_blank" rel="noopener noreferrer">
            <img
              src={Logo}
              alt="5iveBit Logo"
              className={`${styles.navbarLogo} ${styles.tinyLogo}`}
            />
          </a>
          <p
            className={styles.navbarLink}
            onClick={() => (window.location.href = '/cyber-news?from=navbar')}
          >
            Cyber Security News
          </p>
          <p
            className={styles.navbarLink}
            onClick={() => (window.location.href = '/best-practices?from=navbar')}
          >
            Best Practices
          </p>
        </Box>

        {/* Right Side Button */}
        <Button
          className={styles.navbarButton}
          variant="outlined"
          startIcon={<PersonIcon />}
          onClick={() => {
            navigate('/user-profile');
          }}
        >
          {auth?.user ? auth.user?.firstName : 'PROFILE'}
        </Button>
      </Box>
    </Box>
  );
}

export default NavBar;
