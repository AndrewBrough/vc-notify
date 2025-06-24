import { VoiceState } from 'discord.js';
import {
  createVoiceJoinEmbed,
  getVoiceChannelTextChat,
  isVcNotifyMessage,
  shouldCreateNewThread
} from '../utils/functions';

function isChannelChange(oldState: VoiceState, newState: VoiceState): boolean {
  return oldState.channelId !== newState.channelId;
}

async function handleVoiceChannelUpdate(oldState: VoiceState, newState: VoiceState) {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;

  // Only handle user joining a channel
  if (newState.channelId && oldState.channelId !== newState.channelId) {
    const voiceChannel = newState.channel;
    if (!voiceChannel) return;

    const textChannel = getVoiceChannelTextChat(voiceChannel);
    if (!textChannel) return;

    // Get current member count in the voice channel
    const currentMemberCount = voiceChannel.members.size;

    // Find the last vc-notify message in this text channel
    const messages = await textChannel.messages.fetch({ limit: 50 });
    const lastVcNotifyMessage = messages.find(msg => isVcNotifyMessage(msg));

    const embed = createVoiceJoinEmbed(
      newState.member?.displayName || 'Unknown User',
      voiceChannel.name
    );

    // If this is the first person joining (member count = 1) or we should create a new thread
    if (currentMemberCount === 1 || shouldCreateNewThread(lastVcNotifyMessage)) {
      // Create new message and thread
      const message = await textChannel.send({ embeds: [embed] });
      await message.startThread({
        name: `Voice Session - ${voiceChannel.name}`,
        autoArchiveDuration: 60 // 1 hour
      });
    } else if (lastVcNotifyMessage) {
      // Someone else joined - add to existing thread
      try {
        const thread = lastVcNotifyMessage.thread;
        if (thread) {
          await thread.send({ embeds: [embed] });
        } else {
          // Thread doesn't exist, create one
          const newThread = await lastVcNotifyMessage.startThread({
            name: `Voice Session - ${voiceChannel.name}`,
            autoArchiveDuration: 60
          });
          await newThread.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error sending message to thread:', error);
        // Fallback: send new message if thread fails
        const message = await textChannel.send({ embeds: [embed] });
        await message.startThread({
          name: `Voice Session - ${voiceChannel.name}`,
          autoArchiveDuration: 60
        });
      }
    }
  }
}

export default {
  once: false,

  async run(_client: any, oldState: VoiceState, newState: VoiceState) {
    if (!isChannelChange(oldState, newState)) {
      return;
    }

    try {
      await handleVoiceChannelUpdate(oldState, newState);
    } catch (error) {
      console.error('Error handling voice state update:', error);
    }
  },
}; 