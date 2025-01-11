import { Box, Button, Stack, IconButton, Snackbar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRef, useState } from 'react';

// ChatBox component handles the chat interface including message display and input
function ChatBox() {
  const { currentChat, question, setQuestion, generateAnswer } = useChats(); // Get chat-related functions and state from context
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for managing clipboard copy notification
  const contentRef = useRef(null); // state for targeting the element which contains current chat

  // download chat as .txt or as .log
  async function handleDownloadChatFile() {
    const content = contentRef.current?.innerText || '';

    try {
      await window.api.saveFile(content);
      console.log('File saved successfully!');
    } catch (error) {
      console.error('An error occurred while saving the file:', error);
    }
  }

  // Handle sending messages when the user submits a question
  const handleSubmitQuestion = async () => {
    if (question.trim() === '') return; // Don't send empty messages
    const currentQuestion = question;
    setQuestion('');
    await generateAnswer(currentQuestion);
  };

  // Handle keyboard events - allows Enter to send message and Shift+Enter for new line
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitQuestion();
    }
  };

  // Copy message content to clipboard and show notification
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Copied to clipboard:', text);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  // Close the clipboard copy notification
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className={styles.chatBoxContainer}>
      {/* Chat history section displays all messages */}
      <Box className={styles.chatHistory}>
        <Box className={styles.chatHistoryContent} ref={contentRef}>
          {/* Map through messages and render them with appropriate styling */}
          {currentChat.messages?.map((message, index) => (
            <div key={index} className={styles.messageContainer}>
              <p className={message.role === 'user' ? styles.userMessage : styles.botMessage}>
                <span className={message.isThinking ? styles.thinking : ''}>{message.content}</span>
                {message.role === 'assistant' && !message.isThinking && (
                  <IconButton
                    onClick={() => copyToClipboard(message.content)}
                    className={styles.copyButton}
                  >
                    <ContentCopyIcon className={styles.copyIcon} />
                  </IconButton>
                )}
              </p>
            </div>
          ))}
        </Box>
      </Box>

      {/* Message input area with send and voice buttons */}
      <Box>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          multiline
          placeholder="Message 5iveBot (Enter to send, Shift+Enter for new line)"
          maxRows={3}
          className={styles.textarea}
          endDecorator={
            <Stack direction="row" width="100%" justifyContent="flex-end">
              {/* download button for downloading chat */}
              <Button
                onClick={handleDownloadChatFile}
                className={styles.iconButton}
                // disabled={currentChat.questions.length === 0}
              >
                <DownloadIcon />
              </Button>
              {/* Voice input button (functionality to be implemented) */}
              <Button
                className={styles.iconButton}
                onClick={async () => {
                  const options = { buttons: ['saleem', 'khan'] };
                  const res = await window.api.askUserPopup(options);
                  console.log(res);
                }}
              >
                <GraphicEqIcon />
              </Button>
              {/* Send message button - disabled when input is empty */}
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
      {/* Notification popup for successful clipboard copy */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        className={styles.snackbar}
      />
    </Box>
  );
}

export default ChatBox;
