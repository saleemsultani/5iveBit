import { Box, Stack } from '@mui/material';
import styles from '../../App.module.css';
import NavBar from '../common/NavBar';
import ChatBox from './ChatBox';
import RightBar from '../common/RightBar';

function MainPage() {
  return (
    <>
      <NavBar />
      <Box className={styles.content}>
        <Stack direction="row" className={styles.stack}>
          <ChatBox />
          <RightBar />
        </Stack>
      </Box>
    </>
  );
}

export default MainPage;
