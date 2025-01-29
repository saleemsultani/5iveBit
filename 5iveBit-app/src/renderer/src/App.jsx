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

function App() {
  return (
    <ChatsProvider>
      <Router>
        <Box className={styles.container}>
          <Routes>
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/best-practices" element={<BestPractices />} />
            <Route path="/nist-standards" element={<NistStandards />} />
            <Route path="/iso-standards" element={<IsoStandards />} />
            <Route path="/cybercrime-response" element={<CybercrimeResponse />} />
          </Routes>
        </Box>
      </Router>
    </ChatsProvider>
  );
}

export default App;
