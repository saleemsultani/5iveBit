import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom'; 
import styles from './DashNavBar.module.css';
import logo from '../../assets/images/Final_logo.png';

function DashNavBar() {
  return (
    <Box className={styles.dashNavbarContainer}>
      <Box className={styles.dashNavbarContent}>

        {/* Left Side Links */}
        <Box className={styles.dashNavbarLinks}>
          <img src="../assets/images/Final_logo.png" alt="5iveBit Logo" style={{ height: "80px" }} />
        </Box>

      </Box>
    </Box>
  );
}

export default DashNavBar;
