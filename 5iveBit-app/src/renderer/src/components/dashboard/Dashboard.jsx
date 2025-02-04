import styles from './Dashboard.module.css';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashNavBar from './DashNavBar';
import SideBar from './DashSideBar';

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
          <Typography variant="h3" className={styles.welcomeText}>
            Welcome
          </Typography>
          <Button
            variant="contained"
            className={styles.startchatButton}
            onClick={() => navigate('/chat')}
          >
            Get Started &rarr;
          </Button>
        </Box>

        {/* Feature Cards */}
        <Box className={styles.dashboardCards}>
          <Box className={styles.dashboardCard} onClick={() => navigate('/cyber-news')}>
            <img
              src="src/assets/dashboard-cybersecuritynews.png"
              alt="Cyber Security News"
              className={styles.cardImage}
            />
          </Box>
          <Box className={styles.dashboardCard} onClick={() => navigate('/enisa-standards')}>
            <img
              src="/src/assets/dashboard-enisastandard.png"
              alt="ENISA Standards"
              className={styles.cardImage}
            />
          </Box>
          <Box className={styles.dashboardCard} onClick={() => navigate('/nist-standards')}>
            <img
              src="src/assets/dashboard-nistframework.png"
              alt="NIST Cyber Security Framework"
              className={styles.cardImage}
            />
          </Box>

          <Box className={styles.dashboardCard} onClick={() => navigate('/iso-standards')}>
            <img
              src="/src/assets/dashboard-isostandard.png"
              alt="ISO Standard"
              className={styles.cardImage}
            />
          </Box>

          <Box className={styles.dashboardCard} onClick={() => navigate('/best-practices')}>
            <img
              src="/src/assets/dashboard-bestpractice.png"
              alt="Best Practices"
              className={styles.cardImage}
            />
          </Box>

          <Box className={styles.dashboardCard} onClick={() => navigate('/cybercrime-response')}>
            <img
              src="src/assets/dashboard-reportcybercrime.png"
              alt="Understanding Cybercrime"
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
