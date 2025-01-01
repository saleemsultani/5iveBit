import { Box, Button } from '@mui/material'; 
import styles from './DashNavBar.module.css';
import Logo from './images/Final_logo.png'

function DashNavBar() {
  return (
    <Box className={styles.dashNavbarContainer}>
      <Box className={styles.dashNavbarContent}>

        {/*Logo Dashboard Link */}
        <Box className={styles.dashNavbarLinks}>
          <img src={Logo} alt='Logo' style={{ height: '100px' }} />
        </Box>

      </Box>
    </Box>
  );
}

export default DashNavBar;
