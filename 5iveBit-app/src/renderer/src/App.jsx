import { Box, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatsProvider } from './contexts/ChatContext';
import styles from './App.module.css';
import ChatBox from './components/chat/ChatBox';
import NavBar from './components/common/NavBar';
import RightBar from './components/common/RightBar';
import Dashboard from './components/dashboard/Dashboard';
// import PrivateRoute from '../common/PrivateRoute'; // PrivateRoute for secured routes (commented out for now)

function App() {
  return (
    <ChatsProvider>
      <Router>
        <Box className={styles.container}>
          <Routes>
            {/* Define routes for login and signup */}
            {/*Dashboard Route*/}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* App Route */}
            <Route path="/app" element={<App />} />

            {/* Main app content route */}
            <Route
              path="/"
              element={
                <>
                  <NavBar />
                  <Box className={styles.content}>
                    <Stack direction="row" className={styles.stack}>
                      <ChatBox />
                      <RightBar />
                    </Stack>
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
      </Router>
    </ChatsProvider>
  );
}

export default App;
