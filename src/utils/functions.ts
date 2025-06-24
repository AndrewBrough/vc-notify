import { EmbedBuilder, TextChannel, VoiceBasedChannel } from 'discord.js';
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

export function getVoiceChannelTextChat(voiceChannel: VoiceBasedChannel): TextChannel | null {
  if (!voiceChannel || !voiceChannel.guild) {
    console.log('❌ Voice channel or guild is null');
    return null;
  }
  // Try to get the text chat by ID (Discord's new voice channel text chats have the same ID as the voice channel)
  const textChannel = voiceChannel.guild.channels.cache.get(voiceChannel.id);
  if (textChannel && textChannel.isTextBased()) {
    console.log(`✅ Found voice channel text chat: ${textChannel.id}`);
    return textChannel as TextChannel;
  }
  console.log('❌ No associated voice channel text chat found by ID');
  return null;
}

export function isVcNotifyMessage(message: any): boolean {
  // Check if this is a vc-notify message by looking for our embed pattern
  return message.author?.bot && 
         message.embeds?.length > 0 && 
         message.embeds[0]?.title?.includes('joined');
}

export function createVoiceJoinEmbed(memberId: string, channelName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setDescription(`🎤 <@${memberId}> joined ${channelName}`);
}

export function createSecondaryJoinEmbed(memberId: string, channelName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x747f8d)
    .setDescription(`🎤 <@${memberId}> joined ${channelName}`);
}