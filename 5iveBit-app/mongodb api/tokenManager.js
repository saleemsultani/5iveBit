const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../../resources'); // Base directory
const tokenPath = path.join(BASE_DIR, 'token.txt');

export const tokenManager = {
  // Save the token to a file
  saveToken: (token) => {
    try {
      fs.writeFileSync(tokenPath, token, 'utf-8');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  // Get the token from the file
  getToken: () => {
    try {
      if (fs.existsSync(tokenPath)) {
        return fs.readFileSync(tokenPath, 'utf-8'); // Return token
      } else {
        console.log('No token found.');
        return null;
      }
    } catch (error) {
      console.error('Error reading token:', error);
      return null;
    }
  },

  // Delete the token (logout user)
  deleteToken: () => {
    try {
      if (fs.existsSync(tokenPath)) {
        fs.unlinkSync(tokenPath);
      } else {
        console.log('No token file to delete.');
      }
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  }
};
