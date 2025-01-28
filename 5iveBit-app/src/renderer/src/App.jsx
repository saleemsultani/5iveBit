import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatsProvider } from './contexts/ChatContext';
import styles from './App.module.css';
import Dashboard from './components/dashboard/Dashboard';
import ChatWindow from './components/chat/ChatWindow';
import BestPractices from './components/dashboard/BestPractices';

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
          </Routes>
        </Box>
      </Router>
    </ChatsProvider>
  );
}

export default App;
