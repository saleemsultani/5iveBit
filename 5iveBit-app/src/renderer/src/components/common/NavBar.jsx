import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './NavBar.module.css';
import Logo from '../../assets/5iveBitLogo.png';

function NavBar() {
  return (
    <Box className={styles.navbarContainer}>
      <Box className={styles.navbarContent}>
        {/* Left Side Links */}
        <Box className={styles.navbarLinks}>
          <ArrowBackIcon
            className={styles.backArrow}
            onClick={() => (window.location.href = '/dashboard')}
          />
          <a href="https://5ivebit.vercel.app" target="_blank" rel="noopener noreferrer">
            <img
              src={Logo}
              alt="5iveBit Logo"
              className={`${styles.navbarLogo} ${styles.tinyLogo}`}
            />
          </a>
          <p className={styles.navbarLink}>Latest CVEs</p>
          <p className={styles.navbarLink}>Best Practices</p>
        </Box>

        {/* Right Side Button */}
        <Button className={styles.navbarButton} variant="outlined" startIcon={<PersonIcon />}>
          Senior Analyst
        </Button>
      </Box>
    </Box>
  );
}

export default NavBar;
