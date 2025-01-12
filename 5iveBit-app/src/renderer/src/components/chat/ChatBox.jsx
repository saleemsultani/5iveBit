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
import { useState, useRef } from 'react';

// ChatBox component handles the chat interface including message display and input
function ChatBox() {
  const { currentChat, question, setQuestion, generateAnswer } = useChats(); // Get chat-related functions and state from context
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for managing clipboard copy notification
  const contentRef = useRef(null); // state for targeting the element which contains current chat
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [files, setFiles] = useState([]); 
  const fileUploadRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  //Current accepted file types
  const acceptedFileTypes = [
    '.js', '.py', '.java', '.txt', '.html', '.css', '.pdf', '.doc', '.docx', '.c', '.cs', '.jsx' //update different file types
  ];

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

  //Handles uploading users file(s)
  const handleFileUpload = (e) => {
    try {
      const uploadedFiles = Array.from(e.target.files || []);
      if (uploadedFiles.length === 0) 
      {return;}

      const validFiles = uploadedFiles.filter(file => {
      const fileName = file.name.toLowerCase();
        return acceptedFileTypes.some(ext => fileName.endsWith(ext));
      });

      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
      
      if (validFiles.length === uploadedFiles.length) {
        setSnackbarMessage('File(s) uploaded'); }
          else {
          const rejectedCount = uploadedFiles.length - validFiles.length;
          setSnackbarMessage('File type not supported. Please upload a valid file type.');
          }
        setSnackbarOpen(true);
        }
      }  catch (error) {
        console.error('An error occurred when uploading file(s);', error); //add file validation later
        setSnackbarMessage('Failed to upload file(s)');
        setSnackbarOpen(true);
      } 
    };

  //Read file(s) as text - file(s) is pasted into chat as text for chatbot to read - multiple files will appear as one user message
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve({
        name: file.name,
        content: event.target.result
      });
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  //Users can remove one uploaded file from the message input area at a time
  const removeFileUpload = (removeFile) => {
    try {
    setFiles(prevFiles => prevFiles.filter(file => file !== removeFile)); 
    setSnackbarMessage('File removed'); 
    setSnackbarOpen(true); //notifies user that file has been removed 
    } catch (error) {
      console.error('An error occurred when removing the file(s)');
      setSnackbarMessage('Failed to remove file(s)');
      snackbarOpen(true);
    }
  };

  // Handle sending messages when the user submits a question or uploading file(s)
   const handleSubmitQuestion = async () => {
    if ((!question.trim() && files.length === 0) || isSubmitting) return; // Prevents empty submissions

    try {
      setIsSubmitting(true); // Prevents multiple submissions

      if (files.length > 0) {
        try {
          const fileContentsPromises = files.map(readFileContent);
          const fileResults = await Promise.all(fileContentsPromises);

          // C
          const fileMessage = fileResults
            .map(({ name, content }) => `File: ${name}\n${content}`)
            .join('\n\n==========\n\n');

          await generateAnswer(fileMessage);

          setFiles([]);
          if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
          }
        } catch (error) {
          console.error('Error submitting file(s):', error);
          setSnackbarMessage('Error submitting file(s)'); //maybe update error message
          setSnackbarOpen(true);
          return;
        }
      }

      if (question.trim()) {
        const currentQuestion = question;
        setQuestion('');
        await generateAnswer(currentQuestion);
      }
    } finally {
      setIsSubmitting(false);
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
        setSnackbarOpen(true);
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
            files.length > 0 && (
              <Box className={styles.filesPreviewContainer}>
                {files.map((file, index) => (
                  <Box 
                    key={index} 
                    className={styles.filePreview}
                  >
                    <span className={styles.fileName}>
                      {file.name}
                    </span>
                    <IconButton 
                      onClick={() => removeFileUpload(file)}
                      size="small"
                      className={styles.removeFileButton}
                      aria-label={`Remove ${file.name}`}
                    >
                      <CancelIcon 
                        fontSize="small" 
                        className={styles.cancelIcon}
                      />
                    </IconButton>
                  </Box>
                ))}
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
              
              {/* Attach file(s) button */}
              <label htmlFor="file-upload" className={styles.attachFileIcon}>
                <input
                  ref={fileUploadRef}
                  id="file-upload"
                  type="file"
                  accept={acceptedFileTypes.join(',')} 
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                  multiple
                />
                <AttachFileOutlinedIcon className={styles.attachFileIcon} />
              </label>

              {/* Voice input button (functionality to be implemented) */}
              <Button className={styles.iconButton}>
                <GraphicEqIcon />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() && files.length === 0} // Disable if no text or file is present
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
