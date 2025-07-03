import { DMChannel, Events, NonThreadGuildBasedChannel, VoiceBasedChannel } from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import { logError } from '../utils/errorHandling';

const executeChannelDelete = async (channel: DMChannel | NonThreadGuildBasedChannel): Promise<void> => {
  try {
    // Only handle voice channels
    if (!channel.isVoiceBased?.()) return;

    console.log(`🗑️ Voice channel deleted: ${channel.name} (${channel.id})`);

    // Check if there were any active sessions in this channel
    const textChannel = getVoiceChannelTextChat(channel as VoiceBasedChannel);
    if (textChannel) {
      console.log(`📝 Associated text channel found: ${textChannel.name}`);
      
      // Note: We don't delete the session message here as it might be useful
      // to keep a record of the session that was in progress when the channel was deleted
      console.log(`⚠️ Voice channel ${channel.name} was deleted while potentially having active sessions`);
    }

  } catch (error) {
    logError('channel delete', error);
  }
};

export const channelDeleteEvent = {
  name: Events.ChannelDelete,
  execute: executeChannelDelete,
}; 