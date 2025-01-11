import { Box, Button, Stack, IconButton, Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useRef } from 'react';

// ChatBox component handles the chat interface including message display and input
function ChatBox() {
  // Get chat-related functions and state from context
  const { currentChat, question, setQuestion, generateAnswer } = useChats();
  // State for managing clipboard copy notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [file, setFile] = useState(null); //stores user files
  const fileUploadRef = useRef(null);

  const handleFileUpload = (e) => {
    setSnackbarMessage('File uploaded');
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); 
      setSnackbarOpen(true); // Notify the user that the file is ready
    }
  };

  const removeFileUpload = () => {
    setFile(null);
    setSnackbarMessage('File removed');
    setSnackbarOpen(true);

    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }
  };

  // Handle sending messages when the user submits a question or uploading text file
   const handleSubmitQuestion = async () => {
    if (!question.trim() && !file) return; // Prevent empty submissions

    // If file is uploaded, process and send its content
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result; // Get file content
        const fileMessage = `Uploaded file: ${file.name}\n\n${fileContent}`;
        await generateAnswer(fileMessage); // Send file content to chatbot
        setFile(null); // Clear the file after submission

        if (fileUploadRef.current) {
          fileUploadRef.current.value = '';
        }
      };
      reader.readAsText(file); // Reads files content as text pasted into the chatbot -change*
    }

    // If there's a text message, send it
    if (question.trim()) {
      const currentQuestion = question;
      setQuestion(''); // Clear the input field
      await generateAnswer(currentQuestion); // Send the text message
    }
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
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      setSnackbarOpen(true);
    }).catch((err) => {
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
        <Box className={styles.chatHistoryContent}>
          {/* Map through messages and render them with appropriate styling */}
          {currentChat.messages?.map((message, index) => (
            <div key={index} className={styles.messageContainer}>
              <p className={message.role === 'user' ? styles.userMessage : styles.botMessage}>
                <span className={message.isThinking ? styles.thinking : ''}>
                  {message.content}
                </span>
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

      {/* Message input area with send and voice buttons & file upload*/}
      <Box className={styles.inputContainer}>

        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          multiline
          placeholder="Message 5iveBot (Enter to send, Shift+Enter for new line) or upload a file"
          maxRows={3}
          className={styles.textarea}
          startDecorator={
            file && (
              <Box className={styles.filePreview}>
                <span className={styles.fileName}>{file.name}</span>
                <IconButton 
                  onClick={removeFileUpload}
                  size="small"
                  className={styles.removeFileUploadButton}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          }
          endDecorator={
            <Stack direction="row" width="100%" justifyContent="flex-end">
              {/* File upload button */}
              <label htmlFor="file-upload" className={styles.fileUploadIcon}>
                <input
                  ref={fileUploadRef}
                  id="file-upload"
                  type="file"
                  accept=".js,.py,.java,.txt,.html,.css" // Restricted to code-related file types
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                />
                <FileUploadIcon className={styles.fileUploadIcon} />
              </label>

              {/* Voice input button (functionality to be implemented) */}
              <Button className={styles.iconButton}>
                <GraphicEqIcon />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() && !file} // Disable if no text or file is present
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
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        className={styles.snackbar}
      />
    </Box>
  );
}

export default ChatBox;
