import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function startMongoDB() {
  // paths for MongoDB binary, data directory, and log file
  const mongoPath = path.join(__dirname, '../../resources/mongodb/bin/mongod');
  const dataDir = path.join(__dirname, '../../resources/mongodb-data');
  const logPath = path.join(dataDir, 'mongodb.log');

  // Ensure the data directory exists before starting MongoDB
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Arguments to specify the database path and log file location
  const args = ['--dbpath', dataDir, '--logpath', logPath];

  // Spawn the process in the foreground
  const mongoProcess = spawn(mongoPath, args);

  mongoProcess.on('close', (code) => {
    console.log(`MongoDB process exited with code ${code}`);
    if (code === 0) {
      console.log('MongoDB started successfully.');
    } else {
      console.error(`MongoDB failed to start with exit code: ${code}`);
    }
  });

  // Return a promise that resolves when MongoDB starts successfully
  return new Promise((resolve, reject) => {
    mongoProcess.on('spawn', () => {
      resolve();
    });

    mongoProcess.on('error', (error) => {
      console.error('Error starting MongoDB:', error);
      reject(error);
    });
  });
}
