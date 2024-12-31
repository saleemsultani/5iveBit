import styles from './Dashboard.module.css';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashNavBar from '../common/DashNavBar';
import SideBar from '../common/DashSideBar';

function Dashboard() {
  return (
    <Box className={styles.dashboardWrapper}>
      <DashNavBar />
      <Box className={styles.dashboardLayout}>
        <DashboardMain />
        <Sidebar />
      </Box>
    </Box>
  );
}

function DashboardMain() {
  const navigate = useNavigate();

  return (
    <Box className={styles.dashboardMain}>
      <Box className={styles.dashboardContainer}>
        {/* Header Section */}
        <Box className={styles.dashboardHeader}>
          <Typography variant="h1" className={styles.welcomeText}>
            Welcome Back
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={styles.startchatButton}
            onClick={() => navigate('/app')}
          >
            Start New Chat
          </Button>
        </Box>

        {/* Feature Cards */}
        <Box className={styles.dashboardCards}>
          <Box
            className={styles.dashboardCard}
            onClick={() => navigate('/latest-cves')}
          >
            <img
              src="https://via.placeholder.com/300x140"
              alt="Latest CVEs"
              className={styles.cardImage}
            />
          </Box>

          <Box
            className={styles.dashboardCard}
            onClick={() => navigate('/best-practices')}
          >
            <img
              src="https://via.placeholder.com/300x140"
              alt="Best Practices"
              className={styles.cardImage}
            />
          </Box>

          <Box
            className={styles.dashboardCard}
            onClick={() => navigate('/best-practices')}
          >
            <img
              src="https://via.placeholder.com/300x140"
              alt="Best Practices"
              className={styles.cardImage}
            />
          </Box>

          <Box
            className={styles.dashboardCard}
            onClick={() => navigate('/best-practices')}
          >
            <img
              src="https://via.placeholder.com/300x140"
              alt="Best Practices"
              className={styles.cardImage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Sidebar() {
  return (
    <Box className={styles.dashboardSidebar}>
      <SideBar /> 
    </Box>
  );
}

export default Dashboard;