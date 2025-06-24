import { EmbedBuilder, Message, TextChannel, VoiceBasedChannel } from 'discord.js';

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

export function isVcNotifyMessage(message: Message): boolean {
  // Check if this is a vc-notify message by looking for our embed pattern
  return !!(message.author?.bot && 
         message.embeds?.length > 0 && 
         message.embeds[0]?.title?.includes('joined'));
}

export function createVoiceJoinEmbed(memberId: string, channelName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`🎤 Voice session started in ${channelName}`)
    .setFields([
      { name: memberId, value: `is here!` }
    ]);
}

export function createSecondaryJoinEmbed(memberId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x747f8d)
    .setDescription(`<@${memberId}> is here`);
} 