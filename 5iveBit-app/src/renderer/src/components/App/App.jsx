import { Box, Stack } from '@mui/material';
import React from 'react';
import { ChatsProvider } from '../../contexts/ChatContext';
import styles from './App.module.css';
import ChatBox from '../chat/ChatBox';
import NavBar from '../common/NavBar';
import RightBar from '../common/RightBar';

function App() {
  return (
    <ChatsProvider>
      <Box className={styles.container}>
        <NavBar />
        <Box className={styles.content}>
          <Stack direction="row" className={styles.stack}>
            <ChatBox />
            <RightBar />
          </Stack>
        </Box>
      </Box>
    </ChatsProvider>
  );
}

export default App;