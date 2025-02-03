import { Box, Button, Typography } from '@mui/material';
import { useChats } from '../../contexts/ChatContext';

function StartChat() {
  const { setcurrentChat, updateChats } = useChats();

  async function handleStartChat() {
    try {
      const newChat = await window.api.createChat({ messages: [] });

      if (!newChat || !newChat.success) {
        console.error('Failed to create a new chat.');
        return;
      }
      // Set the current chat to the newly created chat
      setcurrentChat({ _id: newChat.chatId, messages: [] });
      updateChats();
    } catch (error) {
      console.log('Error in starting Chat');
      console.error(error);
    }
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100vh",
      color='white',
    >
      <h1>Welcoe to 5ivebit Bot</h1>
      <Button
        sx={{
          backgroundColor: 'blue',
          marginTop: '10%',
          color:'white',
        }}
        onClick={handleStartChat}
      >
        Start Chat
      </Button>
    </Box>
  );
}

export default StartChat;
