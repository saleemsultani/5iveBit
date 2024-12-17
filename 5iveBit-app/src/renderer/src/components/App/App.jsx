import { Box, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatsProvider } from '../../contexts/ChatContext';
import styles from './App.module.css';
import ChatBox from '../chat/ChatBox';
import NavBar from '../common/NavBar';
import RightBar from '../common/RightBar';
// import Login from '../auth/Login';  // Commented out for now
// import SignUp from '../auth/SignUp';  // Commented out for now
// import PrivateRoute from '../common/PrivateRoute'; // PrivateRoute for secured routes (commented out for now)

function App() {
  return (
    <ChatsProvider>
      <Router>
        <Box className={styles.container}>
          <Routes>
            {/* Define routes for login and signup */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/signup" element={<SignUp />} /> */}

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
