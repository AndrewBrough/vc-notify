import fs from 'fs';
import path from 'path';

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function initializeDataDirectory(): void {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  ensureDirectoryExists(dataDir);
  // No files to initialize currently
} 