import fs from 'fs';
import path from 'path';

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function initializeDataFile(filename: string, defaultContent: any): void {
  const filePath = path.join(__dirname, '..', '..', 'data', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, '\t'));
  }
}

export function initializeDataDirectory(): void {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  ensureDirectoryExists(dataDir);
  // Initialize guild.json
  initializeDataFile('guild.json', {});
} 