import { ChannelType, EmbedBuilder, TextChannel } from 'discord.js';
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

export function createVoiceJoinEmbed(memberName: string, channelName: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x57f287) // Green color for join events
    .setTitle(`🎤 ${memberName} joined ${channelName}`)
    .setTimestamp()

  return embed;
}

export function getVoiceChannelTextChat(voiceChannel: any): TextChannel | null {
  if (!voiceChannel || !voiceChannel.guild) return null;
  
  // Find the text channel with the same name in the same category
  const textChannel = voiceChannel.guild.channels.cache.find((channel: any) => 
    channel.type === ChannelType.GuildText && 
    channel.parentId === voiceChannel.parentId && 
    channel.name === voiceChannel.name
  ) as TextChannel;
  
  return textChannel || null;
}

export function isVcNotifyMessage(message: any): boolean {
  // Check if this is a vc-notify message by looking for our embed pattern
  return message.author?.bot && 
         message.embeds?.length > 0 && 
         message.embeds[0]?.title?.includes('joined');
}

export function shouldCreateNewThread(lastMessage: any): boolean {
  if (!lastMessage) return true;
  
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const messageAge = now - lastMessage.createdTimestamp;
  
  return messageAge > oneMinute;
} 