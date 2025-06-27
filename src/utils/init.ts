import fs from 'fs';
import path from 'path';
import { config } from '../config/environment';

const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const initializeDataDirectory = (): void => {
  const dataDir = path.resolve(config.dataDirectory);
  ensureDirectoryExists(dataDir);
  console.log(`📁 Data directory initialized: ${dataDir}`);
};
