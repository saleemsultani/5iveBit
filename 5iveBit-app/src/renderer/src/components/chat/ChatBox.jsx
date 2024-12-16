import { Box, Button, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import Textarea from "@mui/joy/Textarea";
import { useChats } from "../../contexts/ChatContext";
import styles from "./ChatBox.module.css";

function ChatBox() {
  const { currChat, setCurrChat, question, setQuestion } = useChats();

  const handleSubmitQuestion = () => {
    setQuestion("");

    setCurrChat((curr) => {
      const newQuestions = [...curr.questions, question];
      const newAnswers = [...curr.answers, `${curr.questions.length}: here is your random answer`];

      return {
        ...curr,
        questions: newQuestions,
        answers: newAnswers
      };
    });
  };

  return (
    <Box className={styles.chatBoxContainer}>
      {/* Chat history */}
      <Box className={styles.chatHistory}>
        {currChat.questions?.map((item, index) => (
          <div key={index}>
            <p className={styles.userMessage}>{item}</p>
            <p className={styles.botMessage}>{currChat.answers[index]}</p>
          </div>
        ))}
      </Box>

      {/* Input area */}
      <Box>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          placeholder="Search 5iveBot"
          maxRows={3}
          className={styles.textarea}
          endDecorator={
            <Stack direction="row" width="100%" justifyContent="flex-end">
              <Button className={styles.iconButton}>
                <GraphicEqIcon />
              </Button>
              <Button
                onClick={handleSubmitQuestion}
                disabled={question === ""}
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
