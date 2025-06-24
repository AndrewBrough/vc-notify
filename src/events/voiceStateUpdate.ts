import { VoiceBasedChannel, VoiceState } from 'discord.js';
import {
  createVoiceJoinEmbed,
  getVoiceChannelTextChat,
  isVcNotifyMessage
} from '../utils/functions';

function createSecondaryJoinEmbed(memberName: string, channelName: string) {
  return {
    color: 0x747f8d, // Discord grey
    title: `🎤 ${memberName} joined ${channelName}`,
    timestamp: new Date().toISOString(),
  };
}

function isChannelChange(oldState: VoiceState, newState: VoiceState): boolean {
  return oldState.channelId !== newState.channelId;
}

async function handleVoiceChannelUpdate(oldState: VoiceState, newState: VoiceState) {
  console.log('🔍 Voice state update detected');
  console.log(`   Old channel: ${oldState.channelId || 'none'}`);
  console.log(`   New channel: ${newState.channelId || 'none'}`);
  
  const guild = newState.guild || oldState.guild;
  if (!guild) {
    console.log('❌ No guild found');
    return;
  }
  console.log(`   Guild: ${guild.name} (${guild.id})`);

  // Only handle user joining a channel
  if (newState.channelId && oldState.channelId !== newState.channelId) {
    console.log('✅ User is joining a channel');
    
    const voiceChannel = newState.channel as VoiceBasedChannel;
    if (!voiceChannel) {
      console.log('❌ Voice channel not found');
      return;
    }
    console.log(`   Voice channel: ${voiceChannel.name} (${voiceChannel.id})`);

    const textChannel = getVoiceChannelTextChat(voiceChannel);
    if (!textChannel) {
      console.log('❌ Associated text channel not found');
      console.log(`   Looking for text channel with name: ${voiceChannel.name}`);
      console.log(`   In category: ${voiceChannel.parentId || 'no category'}`);
      return;
    }
    console.log(`   Text channel found: ${textChannel.name} (${textChannel.id})`);

    // Get current member count in the voice channel
    const currentMemberCount = voiceChannel.members.size;
    console.log(`   Current member count: ${currentMemberCount}`);

    // Find the last vc-notify message in this text channel
    console.log('🔍 Fetching recent messages...');
    const messages = await textChannel.messages.fetch({ limit: 50 });
    const lastVcNotifyMessage = messages.find(msg => isVcNotifyMessage(msg));
    
    if (lastVcNotifyMessage) {
      console.log(`   Last vc-notify message found: ${lastVcNotifyMessage.id} (${new Date(lastVcNotifyMessage.createdTimestamp).toISOString()})`);
    } else {
      console.log('   No previous vc-notify messages found');
    }

    // If this is the first person joining (member count = 1), send a green embed
    // Otherwise, send a grey embed
    if (currentMemberCount === 1) {
      const embed = createVoiceJoinEmbed(
        newState.member?.displayName || 'Unknown User',
        voiceChannel.name
      );
      await textChannel.send({ embeds: [embed] });
      console.log('🟩 Sent session start (green) embed');
    } else {
      const embed = createSecondaryJoinEmbed(
        newState.member?.displayName || 'Unknown User',
        voiceChannel.name
      );
      await textChannel.send({ embeds: [embed] });
      console.log('⬜ Sent secondary join (grey) embed');
    }
  } else {
    console.log('⏭️  Not a join event, skipping');
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
      console.error('❌ Error handling voice state update:', error);
    }
  },
}; 