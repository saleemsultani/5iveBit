import { Box, Button, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';

function ChatBox() {
  const { currentChat, question, setQuestion, generateAnswer } = useChats();

  const handleSubmitQuestion = async () => {
    const currentQuestion = question;
    setQuestion('');
    await generateAnswer(currentQuestion);
  };

  return (
    <Box className={styles.chatBoxContainer}>
      <Box className={styles.chatHistory}>
        {currentChat.messages?.map((message, index) => (
          <div key={index}>
            <p className={message.role === 'user' ? styles.userMessage : styles.botMessage}>
              {message.content}
            </p>
          </div>
        ))}
      </Box>

      {/* Input area */}
      <Box>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          placeholder="Message 5iveBot"
          maxRows={3}
          className={styles.textarea}
          endDecorator={
            <Stack direction="row" width="100%" justifyContent="flex-end">
              <Button className={styles.iconButton}>
                <GraphicEqIcon />
              </Button>
              <Button
                onClick={handleSubmitQuestion}
                disabled={question === ''}
                className={styles.iconButton}
              >
                <SendIcon />
              </Button>
            </Stack>
          }
        />
      </Box>
    </Box>
  );
}

export default ChatBox;
