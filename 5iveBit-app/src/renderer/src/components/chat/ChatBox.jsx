import { Box, Button, Stack, IconButton, Snackbar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
//import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useState, useRef } from 'react';

// ChatBox component handles the chat interface including message display and input
function ChatBox() {
  const { currentChat, question, setQuestion, generateAnswer } = useChats(); // Get chat-related functions and state from context
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for managing clipboard copy notification
  const contentRef = useRef(null); // state for targeting the element which contains current chat
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [file, setFile] = useState(null); //stores user files
  const fileUploadRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
      if (uploadedFile) {
        setFile(uploadedFile); 
        setSnackbarMessage('File uploaded');
      setSnackbarOpen(true); // Notify the user that the file is ready
    }
  }; 
  
  const removeFileUpload = () => {
    setFile(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }
    setSnackbarMessage('File removed');
    setSnackbarOpen(true);
  };

  // Handle sending messages when the user submits a question or uploading text file
   const handleSubmitQuestion = async () => {
    if ((!question.trim() && !file) || isSubmitting) return; // Prevent empty submissions

    try {
      setIsSubmitting(true); // Prevent multiple submissions

      if (file) {
        const reader = new FileReader();
        
        // Convert FileReader to Promise for better control flow
        const readFileContent = new Promise((resolve, reject) => {
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });

        try {
          const fileContent = await readFileContent;
          const fileMessage = `Uploaded file: ${file.name}\n\n${fileContent}`;
          await generateAnswer(fileMessage);
          
          // Clear file state and input after successful submission
          setFile(null);
          if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
          }
        } catch (error) {
          console.error('Error reading file:', error);
          setSnackbarMessage('Error processing file');
          setSnackbarOpen(true);
        }
      }

      if (question.trim()) {
        const currentQuestion = question;
        setQuestion('');
        await generateAnswer(currentQuestion);
      }
    } finally {
      setIsSubmitting(false); // Reset submission state
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
              {/* download button for downloading chat */}
              <Button
                onClick={handleDownloadChatFile}
                className={styles.iconButton}
                // disabled={currentChat.questions.length === 0}
              >
                <DownloadIcon />
              </Button>
              
              {/* File upload button */}
              <label htmlFor="file-upload" className={styles.fileUploadIcon}>
                <input
                  ref={fileUploadRef}
                  id="file-upload"
                  type="file"
                  accept=".js,.py,.java,.txt,.html,.css, .pdf, .doc" 
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                />
                <AttachFileOutlinedIcon className={styles.fileUploadIcon} />
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
