import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatsProvider } from './contexts/ChatContext';
import styles from './App.module.css';
import Dashboard from './components/dashboard/Dashboard';
import ChatWindow from './components/chat/ChatWindow';
import BestPractices from './components/dashboard/BestPractices';
import NistStandards from './components/dashboard/NistStandards';
import IsoStandards from './components/dashboard/IsoStandards';
import CybercrimeResponse from './components/dashboard/CybercrimeResponse';
import CyberSecurityNews from './components/dashboard/CyberSecurityNews';
import PrivateRoute from './components/User/PrivateRoute';
import RegisterUser from './components/User/RegisterUser';
import LoginUser from './components/User/LoginUser';
import UserProfile from './components/User/UserProfile';
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <AuthProvider>
      <ChatsProvider>
        <Router>
          <Box className={styles.container}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<PrivateRoute />}>
                <Route path="" element={<ChatWindow />} />
              </Route>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/best-practices" element={<BestPractices />} />
              <Route path="/nist-standards" element={<NistStandards />} />
              <Route path="/iso-standards" element={<IsoStandards />} />
              <Route path="/cybercrime-response" element={<CybercrimeResponse />} />
              <Route path="/cyber-news" element={<CyberSecurityNews />} />
              {/* user related */}
              <Route path="/register-user" element={<RegisterUser />} />
              <Route path="/login-user" element={<LoginUser />} />
              <Route path="/user-profile" element={<PrivateRoute />}>
                <Route path="" element={<UserProfile />} />
              </Route>
            </Routes>
          </Box>
        </Router>
      </ChatsProvider>
    </AuthProvider>
  );
}

export default App;
