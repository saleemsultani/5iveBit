import { Box } from '@mui/material';
import styles from './DashNavBar.module.css';
import Logo from '../../assets/5iveBitLogo.png';

function DashNavBar() {
  return (
    <Box className={styles.dashNavbarContainer}>
      <Box className={styles.dashNavbarContent}>
        {/*Logo Dashboard Link */}
        <Box className={styles.dashNavbarLinks}>
          <img
            src={Logo}
            alt="Logo"
            style={{ height: '50px', marginLeft: '50px', marginTop: '5px' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default DashNavBar;
