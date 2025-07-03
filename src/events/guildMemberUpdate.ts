import { Events, GuildMember, PartialGuildMember } from 'discord.js';
import { logError } from '../utils/errorHandling';

const executeGuildMemberUpdate = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> => {
  try {
    // Check if user is in a voice channel
    const voiceState = newMember.voice;
    if (!voiceState.channel) return;

    // Log voice state changes for debugging
    const oldVoiceState = oldMember.voice;
    const hasVoiceStateChanged = 
      oldVoiceState.deaf !== newMember.voice.deaf ||
      oldVoiceState.mute !== newMember.voice.mute ||
      oldVoiceState.selfDeaf !== newMember.voice.selfDeaf ||
      oldVoiceState.selfMute !== newMember.voice.selfMute ||
      oldVoiceState.streaming !== newMember.voice.streaming;

    if (hasVoiceStateChanged) {
      console.log(`🎤 Voice state changed for ${newMember.user.tag} in ${voiceState.channel.name}:`, {
        deaf: `${oldVoiceState.deaf} → ${newMember.voice.deaf}`,
        mute: `${oldVoiceState.mute} → ${newMember.voice.mute}`,
        selfDeaf: `${oldVoiceState.selfDeaf} → ${newMember.voice.selfDeaf}`,
        selfMute: `${oldVoiceState.selfMute} → ${newMember.voice.selfMute}`,
        streaming: `${oldVoiceState.streaming} → ${newMember.voice.streaming}`,
      });
    }

    // Check for role changes that might affect notifications
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    if (oldRoles.size !== newRoles.size) {
      console.log(`👥 Role change for ${newMember.user.tag}: ${oldRoles.size} → ${newRoles.size} roles`);
    }

  } catch (error) {
    logError('guild member update', error);
  }
};

export const guildMemberUpdateEvent = {
  name: Events.GuildMemberUpdate,
  execute: executeGuildMemberUpdate,
}; 