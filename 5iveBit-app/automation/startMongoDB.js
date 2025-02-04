import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function startMongoDB() {
  const mongoPath = path.join(__dirname, '../../resources/mongodb/bin/mongod');
  const dataDir = path.join(__dirname, '../../resources/mongodb-data');
  const logPath = path.join(dataDir, 'mongodb.log');

  // Ensure the data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Prepare arguments for the command
  const args = ['--dbpath', dataDir, '--logpath', logPath];

  // Spawn the process in the foreground (no --fork)
  const mongoProcess = spawn(mongoPath, args);

  mongoProcess.on('close', (code) => {
    console.log(`MongoDB process exited with code ${code}`);
    if (code === 0) {
      console.log('MongoDB started successfully.');
    } else {
      console.error(`MongoDB failed to start with exit code: ${code}`);
    }
  });

  // Return a promise that resolves when MongoDB starts
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
