import { Events, GuildMember, PartialGuildMember } from 'discord.js';
import { logError } from '../utils/errorHandling';

const executeGuildMemberRemove = async (member: GuildMember | PartialGuildMember): Promise<void> => {
  try {
    // Check if the user was in a voice channel when they left
    const voiceState = member.voice;
    if (voiceState.channel) {
      console.log(`👋 User ${member.user.tag} left server while in voice channel: ${voiceState.channel.name}`);
      
      // Note: The voiceStateUpdate event should handle this automatically,
      // but we log it here for debugging purposes
      console.log(`📊 Voice channel ${voiceState.channel.name} now has ${voiceState.channel.members.size} members`);
    }

  } catch (error) {
    logError('guild member remove', error);
  }
};

export const guildMemberRemoveEvent = {
  name: Events.GuildMemberRemove,
  execute: executeGuildMemberRemove,
}; 