import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  // custom API for saving file
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  //export pdf
  exportPDF: (content) => ipcRenderer.invoke('export-pdf', content),
  // pop for human in the loop
  askUserPopup: (options) => ipcRenderer.invoke('popup-for-user-in-loop', options),
  // update file
  updateFile: (fileDetails, content) => ipcRenderer.invoke('update-file', fileDetails, content),
  // check port status
  checkPortStatus: (port, host) => ipcRenderer.invoke('check-port-status', port, host),
  // find available port
  findAvailablePort: (startPort, endPort, host) =>
    ipcRenderer.invoke('find-available-port', startPort, endPort, host),
  // find in-use port
  findInUsePort: (startPort, endPort, host) =>
    ipcRenderer.invoke('find-in-use-port', startPort, endPort, host),

  // User
  // Register User
  registerUser: (userData) => ipcRenderer.invoke('register-user', userData),
  // Login User
  loginUser: (userData) => ipcRenderer.invoke('login-user', userData),
  // Log Out
  logoutUser: () => ipcRenderer.invoke('logout-user'),
  // Check Authentication
  checkAuth: () => ipcRenderer.invoke('check-auth'),
  // Update Password
  updatePassword: (userData) => ipcRenderer.invoke('update-password', userData),

  // chat
  // Create Chat
  createChat: (chatData) => ipcRenderer.invoke('create-chat', chatData),
  // get All chats
  getAllChats: () => ipcRenderer.invoke('get-all-chats'),
  // update chat
  updateChat: (chatData) => ipcRenderer.invoke('update-chat', chatData)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api; // Attach the custom API to the global window
}
