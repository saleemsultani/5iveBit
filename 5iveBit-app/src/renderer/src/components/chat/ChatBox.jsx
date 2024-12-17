import { Box, Button, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';

function ChatBox() {
  const { currentChat, setcurrentChat, question, setQuestion, generateAnswer } = useChats();

  const handleSubmitQuestion = async () => {
    const currentQuestion = question;
    console.log('Submitting question:', currentQuestion);
    setQuestion('');

    setcurrentChat((current) => {
      console.log('Updating chat with thinking message');
      const newQuestions = [...current.questions, currentQuestion];
      return {
        ...current,
        questions: newQuestions,
        answers: [...current.answers, 'Thinking...']
      };
    });

    console.log('Waiting for API response...');
    const answer = await generateAnswer(currentQuestion);
    console.log('Received answer:', answer);

    setcurrentChat((current) => {
      console.log('Updating chat with final answer');
      const newAnswers = [...current.answers];
      newAnswers[newAnswers.length - 1] = answer;
      return {
        ...current,
        answers: newAnswers
      };
    });
  };

  return (
    <Box className={styles.chatBoxContainer}>
      {/* Chat history */}
      <Box className={styles.chatHistory}>
        {currentChat.questions?.map((item, index) => (
          <div key={index}>
            <p className={styles.userMessage}>{item}</p>
            <p className={styles.botMessage}>{currentChat.answers[index]}</p>
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
