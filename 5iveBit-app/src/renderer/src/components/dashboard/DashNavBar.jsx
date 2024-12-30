import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom'; 
import styles from './DashNavBar.module.css';

function DashNavBar() {
  return (
    <Box className={styles.dashNavbarContainer}>
      <Box className={styles.dashNavbarContent}>
        {/* Left Side Links */}
        <Box className={styles.dashNavbarLinks}>
          <p className={styles.dashNavbarLink}>5iveBit.</p>
        </Box>
      </Box>
    </Box>
  );
}

export default DashNavBar;
