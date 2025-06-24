import { EmbedBuilder } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';

export function readJSON(filePath: string): Record<string, any> {
  const file = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(file);
  return json;
}

export function writeJSON(filePath: string, dataPath: string, data: any): void {
  const file = readJSON(filePath);
  const pathParts = dataPath.split('.');
  let current: Record<string, any> = file;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!part) continue;
    
    if (!(part in current) || current[part] === undefined) {
      current[part] = {};
    }
    current = current[part] as Record<string, any>;
  }
  
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart) {
    if (data === null) {
      delete current[lastPart];
    } else {
      current[lastPart] = data;
    }
  }
  
  const newJSON = JSON.stringify(file, null, '\t');
  writeFileSync(filePath, newJSON);
}

export function successEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0x57f287);
}

export function errorEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0xed4245);
} 