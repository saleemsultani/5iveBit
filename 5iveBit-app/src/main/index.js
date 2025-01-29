import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import fs from 'fs';
import os from 'os';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

// Function to get the default download folder based on the operating system
const getDownloadsFolder = () => {
  const homeDir = os.homedir(); // Get the user's home directory
  // Check for OS platform and return appropriate path
  if (os.platform() === 'win32') {
    // On Windows, the Downloads folder is under the user's home directory
    return join(homeDir, 'Downloads');
  } else if (os.platform() === 'darwin') {
    // On macOS, the Downloads folder is also in the user's home directory
    return join(homeDir, 'Downloads');
  } else {
    // On Linux and other Unix-like systems, it's usually the Downloads folder under home
    return join(homeDir, 'Downloads');
  }
};

// Creating Main Window
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  // Set up proper CSP headers
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        `default-src 'self';
         connect-src 'self' http://localhost:11434 https://cve.circl.lu https://app.opencve.io;
         script-src 'self' 'unsafe-inline';
         style-src 'self' 'unsafe-inline';
         img-src 'self' data: https:;
         font-src 'self' data:;`
      ],
      'Access-Control-Allow-Origin': ['*'],
      'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, OPTIONS'],
      'Access-Control-Allow-Headers': ['Content-Type, Authorization']
    };

    // Ensure only one value for 'Access-Control-Allow-Origin'
    if (responseHeaders['Access-Control-Allow-Origin']) {
      responseHeaders['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    }

    callback({
      responseHeaders
    });
  });

  // Configure CORS for the session
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    { urls: ['http://localhost:11434/*', 'https://cve.circl.lu/*'] },
    (details, callback) => {
      callback({
        requestHeaders: {
          ...details.requestHeaders,
          Origin: 'http://localhost:5173'
        }
      });
    }
  );

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Open the DevTools. For development purposes only. Comment out when not used.
  //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Handle save-file event from renderer process
ipcMain.handle('save-file', async (_, content) => {
  try {
    // Get the default Downloads folder path based on the platform
    const downloadsFolder = getDownloadsFolder();

    // Show Save File dialog with dynamic default path
    const { filePath } = await dialog.showSaveDialog({
      title: 'Download Chat',
      defaultPath: join(downloadsFolder, 'content.txt'), // Set default path to the Downloads folder
      buttonLabel: 'Save',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'PDF Files', extensions: ['pdf'] },
        { name: 'Log Files', extensions: ['log'] }
      ]
    });

    if (filePath) {
      // Write content to the selected file
      fs.writeFileSync(filePath, content, 'utf-8');
      return { success: true, message: 'File saved successfully!' };
    } else {
      return { success: false, message: 'Save cancelled by user.' };
    }
  } catch (error) {
    console.error('Failed to save file:', error);
    return { success: false, message: 'Failed to save file.' };
  }
});

// /////////////////////////////////////////////

// Listen for the file update request from the renderer process
ipcMain.handle('update-file', async (event, fileDetails, content) => {
  console.log(fileDetails);
  const filePath = fileDetails[0].filePath;
  console.log(filePath);
  try {
    // Append or modify the file content
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });

    // Respond with success
    return {
      success: true,
      message: `File updated successfully: ${filePath}`
    };
  } catch (error) {
    console.error('Error updating file:', error);
    return {
      success: false,
      message: `Failed to update file: ${error.message}`
    };
  }
});

// ///////////////////////////////////////////////

// pop-for-user-in-loop
ipcMain.handle('popup-for-user-in-loop', async (event, options) => {
  const { type, title, message, buttons } = options;

  const result = await dialog.showMessageBox({
    type: type || 'question',
    buttons: buttons || ['Yes', 'No'],
    defaultId: 1, // Index of the default button
    title: title || '5iveBot',
    message: message || 'Do you want to proceed?',
    cancelId: buttons.length
  });

  // Detect if the dialog was canceled (via close button or Esc key)
  if (result.canceled || result.response === buttons.length) {
    return false;
  }

  // Return the selected button's value
  const returnValue = buttons ? buttons[result.response] : null;
  return returnValue;
});
