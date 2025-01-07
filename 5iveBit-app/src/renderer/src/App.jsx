import { Box, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatsProvider } from './contexts/ChatContext';
import styles from './App.module.css';
import Dashboard from './components/dashboard/Dashboard';
import ChatWindow from './components/chat/ChatWindow';
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
            <Route path="/" element={<ChatWindow />} />
          </Routes>
        </Box>
      </Router>
    </ChatsProvider>
  );
}

export default App;
