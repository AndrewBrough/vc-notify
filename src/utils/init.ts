import fs from 'fs';
import path from 'path';

const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const initializeDataDirectory = (): void => {
  const dataDir = path.resolve(import.meta.env.DISCORD_BOT_DATA_DIR);
  ensureDirectoryExists(dataDir);
  console.log(`📁 Data directory initialized: ${dataDir}`);
};
