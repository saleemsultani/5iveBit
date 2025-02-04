import axios from 'axios';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import tar from 'tar';
import { getOSInfo } from './getOSInfo';

const BASE_DIR = path.join(__dirname, '../../resources'); // Base directory
const MONGO_DIR = path.join(BASE_DIR, 'mongodb'); // Final MongoDB directory

export async function downloadMongoDB() {
  const { platform, arch } = getOSInfo();
  console.log('Detected OS:', platform, 'Architecture:', arch);

  let url;
  let archiveExt;

  if (platform === 'win32') {
    url = `https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.4.zip`;
    archiveExt = '.zip';
  } else if (platform === 'darwin') {
    if (arch === 'x64') {
      url = `https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-8.0.4.tgz`;
    } else {
      url = `https://fastdl.mongodb.org/osx/mongodb-macos-arm64-8.0.4.tgz`;
    }
    archiveExt = '.tgz';
  } else {
    throw new Error(`Unsupported platform/architecture: ${platform}/${arch}`);
  }

  // Skip download if MongoDB is already installed
  if (fs.existsSync(MONGO_DIR)) {
    console.log('MongoDB is already installed at:', MONGO_DIR);
    return;
  }

  console.log(`Downloading MongoDB from: ${url}`);

  // Ensure the base directory exists
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }

  const downloadPath = path.join(BASE_DIR, `mongodb-${platform}-${arch}${archiveExt}`);

  // Download the file using axios
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const fileStream = fs.createWriteStream(downloadPath);
    response.data.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', async () => {
        console.log(`Downloaded MongoDB to: ${downloadPath}`);
        try {
          // Extract MongoDB
          await extractMongoDB(downloadPath, MONGO_DIR, platform);

          // Remove the archive file after extraction
          fs.unlinkSync(downloadPath);
          console.log(`Removed the archive file: ${downloadPath}`);

          resolve();
        } catch (err) {
          reject(err);
        }
      });

      fileStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading MongoDB:', error.message);
    throw new Error(`Failed to download MongoDB from ${url}`);
  }
}

async function extractMongoDB(filePath, outputDir, platform) {
  console.log(`Extracting MongoDB...`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (platform === 'win32') {
    // Windows: Extract ZIP
    const zip = new AdmZip(filePath);
    zip.extractAllTo(outputDir, true);

    // Get extracted contents
    const extractedFiles = fs.readdirSync(outputDir);

    if (extractedFiles.length === 1) {
      const topLevelFolder = path.join(outputDir, extractedFiles[0]);

      // Check if it's a directory (meaning it's a wrapper folder we want to remove)
      if (fs.statSync(topLevelFolder).isDirectory()) {
        // Move all files inside topLevelFolder up one level
        fs.readdirSync(topLevelFolder).forEach((file) => {
          fs.renameSync(path.join(topLevelFolder, file), path.join(outputDir, file));
        });

        // Remove the empty top-level folder
        fs.rmdirSync(topLevelFolder);
      }
    }
  } else {
    // macOS: Extract .tgz
    await tar.x({
      file: filePath,
      cwd: outputDir,
      strip: 1 // Remove the top-level folder during extraction
    });
  }

  console.log(`Extracted MongoDB to: ${outputDir}`);
}
