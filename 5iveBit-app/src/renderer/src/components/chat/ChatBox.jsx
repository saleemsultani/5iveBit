import { Box, Button, Stack, IconButton, Snackbar, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import Textarea from '@mui/joy/Textarea';
import { useChats } from '../../contexts/ChatContext';
import styles from './ChatBox.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatMessage, isLikelyCode } from './ChatFormatCode';
import { useState, useRef, useEffect } from 'react';
import StartChat from './StartChat';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { shouldRenderSavePDF } from '../../CVE/cveHandler';
import { marked } from 'marked'; // Correctly import marked

// ChatBox component handles the chat interface including message display and input
function ChatBox() {
  const { chats, handleNewChat, currentChat, question, setQuestion, generateAnswer } = useChats(); // Get chat-related functions and state from context
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for managing clipboard copy notification
  const contentRef = useRef(null); // state for targeting the element which contains current chat
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileUploadRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState([]);

  // Auto-scroll to the bottom of the chat history when new messages are added
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  // download chat as .txt or as .log
  async function handleDownloadChatFile(codeContent) {
    try {
      let content;
      // Check if codeContent is provided and is a string
      if (codeContent && typeof codeContent === 'string') {
        content = codeContent;
      } else {
        // Fallback to getting content from the ref
        content = contentRef.current?.innerText || '';
      }

      // For debugging
      console.log('Content to save:', content);

      // Send to Electron API
      await window.api.saveFile(content);
      console.log('File saved successfully!');
    } catch (error) {
      console.error('An error occurred while saving the file:', error);
    }
  }

  // /////////////////////////////////////////////////
  const handleUpdateFile = async (content) => {
    try {
      const options = {
        type: 'warning',
        title: 'Update file Confirmation',
        message: `Are you sure you want update the file ${currentUploadedFiles[0].fileName} ?`,
        buttons: ['Update', 'Cancel']
      };
      const result = await window.api.askUserPopup(options);
      if (result === 'Update') {
        await window.api.updateFile(currentUploadedFiles, content);
        console.log('File updated successfully!');
      } else {
        throw new Error('File update cancelled');
      }
    } catch (error) {
      console.error('An error occurred while saving the file:', error);
    }
  };
  // /////////////////////////////////////////////////

  //Current accepted file types for upload
  const acceptedFileTypes = [
    '.js',
    '.py',
    '.java',
    '.txt',
    '.html',
    '.htm',
    '.css',
    '.c',
    '.cs',
    '.cpp',
    '.jsx',
    '.php',
    '.aspx',
    '.jsp',
    '.dart',
    '.ejs',
    '.sql',
    '.md',
    '.yaml',
    '.yml',
    '.htm',
    '.mjs',
    '.sass',
    '.vue',
    '.tsx',
    '.bson',
    '.csv',
    '.log',
    '.syslog',
    '.xml',
    '.xlsx',
    'xls',
    '.ts',
    '.sh',
    '.rb',
    '.json'
  ];

  //Handles uploading users file(s)
  const handleFileUpload = (e) => {
    try {
      const uploadedFiles = Array.from(e.target.files || []);
      if (uploadedFiles.length === 0) {
        return;
      }

      const validFiles = uploadedFiles.filter((file) => {
        const fileName = file.name.toLowerCase();
        return acceptedFileTypes.some((ext) => fileName.endsWith(ext));
      });

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);

        // //////////////////////////////////////////
        // take a note of each uploaded file
        validFiles.forEach((file) => {
          console.log('file Path: ', file.path);
          const filePath = file.path;
          const fileName = file.name;
          const fileExtension = fileName.slice(fileName.lastIndexOf('.'));

          setCurrentUploadedFiles((curr) => {
            return [...curr, { filePath, fileName, fileExtension }];
          });
        });

        // //////////////////////////////////////////

        if (validFiles.length === uploadedFiles.length) {
          setSnackbarMessage('File(s) uploaded');
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('An error occurred when uploading file(s);', error); //add file validation later
      setSnackbarMessage('Failed to upload file(s)');
      setSnackbarOpen(true);
    }
  };

  //Read file(s) as text - file(s) is pasted into chat as text for chatbot to read - multiple files will appear as one user message
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) =>
        resolve({
          name: file.name,
          content: `File: ${file.name}\n\`\`\`\n${event.target.result}\n\`\`\``
        });
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  //Users can remove one uploaded file from the message input area at a time
  const removeFileUpload = (removeFile) => {
    try {
      setFiles((prevFiles) => prevFiles.filter((file) => file !== removeFile));
      setSnackbarMessage('File removed');
      setSnackbarOpen(true); //notifies user that file has been removed
    } catch (error) {
      console.error('An error occurred when removing the file(s)');
      setSnackbarMessage('Failed to remove file(s)');
      snackbarOpen(true);
    }
  };

  // Handle sending messages when the user submits a question or uploads file(s)
  const handleSubmitQuestion = async () => {
    if ((!question.trim() && files.length === 0) || isSubmitting) return; // Prevents empty submissions

    try {
      setIsSubmitting(true); // Prevents multiple submissions
      let messageParts = [];

      const currentQuestion = question.trim();

      // Process question if it exists
      if (currentQuestion) {
        let processedQuestion = currentQuestion;
        if (!currentQuestion.includes('```') && isLikelyCode(currentQuestion)) {
          processedQuestion = `\`\`\`\n${currentQuestion}\n\`\`\``;
        }
        messageParts.push(processedQuestion);
      }

      // Process file(s) if they exist
      if (files.length > 0) {
        try {
          const fileContents = await Promise.all(files.map(readFileContent));
          fileContents.forEach(({ content }) => {
            messageParts.push(content);
          });

          // Clear file states after processing - no longer appear in message input box
          setFiles([]);
          if (fileUploadRef.current) {
            fileUploadRef.current.value = '';
          }
        } catch (error) {
          console.error('Error sending message', error);
          setSnackbarMessage('Failed to send message');
          setSnackbarOpen(true);
          return;
        }
      }

      // If there is a question to send
      if (messageParts.length > 0) {
        const combinedMessage = messageParts.join('\n\n-\n\n');

        // Clear the question input before sending - no longer appears in message input box
        setQuestion('');

        //Sends message
        await generateAnswer(combinedMessage);
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
        setSnackbarMessage('Copied to clipboard');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        setSnackbarMessage('Failed to copy');
        setSnackbarOpen(true);
      });
  };

  // Close the clipboard copy notification
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Modify the savePDF function to convert markdown to HTML before saving
  const savePDF = async (content) => {
    try {
      const htmlContent = marked(content); // Convert markdown to HTML
      const result = await window.api.savePDF(htmlContent);
      setSnackbarMessage(result.message);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving PDF:', error);
      setSnackbarMessage('Failed to save PDF');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box className={styles.chatBoxContainer}>
        {/* Chat history section displays all messages */}
        <Box className={styles.chatHistory}>
          <Box className={styles.chatHistoryContent} ref={contentRef}>
            {/* Map through messages and render them with appropriate styling */}
            {currentChat?.messages?.map((message, index) => (
              <div key={index} className={styles.messageContainer}>
                <p className={message.role === 'user' ? styles.userMessage : styles.botMessage}>
                  <span className={message.isThinking ? styles.thinking : ''}>
                    {formatMessage(
                      message.content,
                      copyToClipboard,
                      message.role,
                      handleUpdateFile,
                      currentUploadedFiles,
                      handleDownloadChatFile
                    )}
                  </span>
                  {message.role === 'assistant' && !message.isThinking && (
                    <div className={styles.messageActions}>
                      <IconButton
                        onClick={() => copyToClipboard(message.content)}
                        className={styles.actionButton}
                      >
                        <ContentCopyIcon className={styles.actionIcon} />
                      </IconButton>
                    </div>
                  )}
                </p>
                {!message.isThinking &&
                  index === currentChat.messages.length - 1 &&
                  shouldRenderSavePDF && (
                    <div className={styles.pdfBanner}>
                      <Button
                        onClick={() => savePDF(message.content)}
                        className={styles.pdfButton}
                        style={{ color: 'white' }}
                      >
                        Click here to export this information as a PDF
                      </Button>
                    </div>
                  )}
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
                    <Box key={index} className={styles.filePreview}>
                      <span className={styles.fileName}>{file.name}</span>
                      <IconButton
                        onClick={() => removeFileUpload(file)}
                        size="small"
                        className={styles.removeFileButton}
                        aria-label={`Remove ${file.name}`}
                      >
                        <CancelIcon fontSize="small" className={styles.cancelIcon} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )
            }
            endDecorator={
              <Stack direction="row" width="100%" justifyContent="flex-end">
                {/* download button for downloading chat */}
                <Button onClick={handleDownloadChatFile} className={styles.iconButton}>
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

        {/* Disclaimer at the bottom */}
        <Box
          sx={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'sans-serif'
            }}
          >
            Disclaimer: 5iveBot is AI, not a human expert—double-check critical information!
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default ChatBox;
