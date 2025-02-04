import { Box, Stack } from '@mui/material';
import styles from '../../App.module.css';
import NavBar from '../common/NavBar';
import ChatBox from './ChatBox';
import RightBar from '../common/RightBar';
import StartChat from './StartChat';
import { useChats } from '../../contexts/ChatContext';

function MainPage() {
  const { chats } = useChats();

  return (
    <>
      <NavBar />
      <Box className={styles.content}>
        {/* check if the the chat is empty */}
        {!chats[0]?._id ? (
          <StartChat />
        ) : (
          <Stack direction="row" className={styles.stack}>
            <ChatBox />
            <RightBar />
          </Stack>
        )}
      </Box>
    </>
  );
}

export default MainPage;
