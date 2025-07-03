import { Events, GuildMember } from 'discord.js';
import { logError } from '../utils/errorHandling';

const executeGuildMemberAdd = async (member: GuildMember): Promise<void> => {
  try {
    // Check if the user is already in a voice channel when they join
    const voiceState = member.voice;
    if (voiceState.channel) {
      console.log(`👋 User ${member.user.tag} joined server while already in voice channel: ${voiceState.channel.name}`);
      
      // This is unusual but can happen if:
      // 1. User was moved to the server while in a voice channel
      // 2. Bot was offline when user joined and joined voice channel
      console.log(`📊 Voice channel ${voiceState.channel.name} now has ${voiceState.channel.members.size} members`);
    }

  } catch (error) {
    logError('guild member add', error);
  }
};

export const guildMemberAddEvent = {
  name: Events.GuildMemberAdd,
  execute: executeGuildMemberAdd,
}; 