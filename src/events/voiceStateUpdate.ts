import { PermissionFlagsBits, TextChannel, VoiceState } from 'discord.js';
import { formatTime, readJSON } from '../utils/functions';

function isPrivateChannel(channel: any): boolean {
  if (!channel) return false;
  const everyoneRole = channel.guild.roles.everyone;
  return !channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel);
}

function isChannelChange(oldState: VoiceState, newState: VoiceState): boolean {
  return oldState.channelId !== newState.channelId;
}

async function handlePublicChannelUpdate(oldState: VoiceState, newState: VoiceState, announcementChannel: TextChannel, timezone?: string) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = formatTime(new Date(), timezone);
    await announcementChannel.send(
      `${newState.member?.displayName} joined ${newState.channel.name} at ${joinTime}`
    );
  }
}

async function handlePrivateChannelUpdate(oldState: VoiceState, newState: VoiceState, announcementChannel: TextChannel, timezone?: string) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = formatTime(new Date(), timezone);
    await announcementChannel.send(
      `${newState.member?.displayName} joined private ${newState.channel.name} at ${joinTime}`
    );
  }
}

export default {
  once: false,

  async run(_client: any, oldState: VoiceState, newState: VoiceState) {
    if (!isChannelChange(oldState, newState)) {
      return;
    }

    const guildData = readJSON('./data/guild.json')[newState.guild?.id || oldState.guild?.id];
    if (!guildData) return;

    const channel = newState.channel || oldState.channel;
    const isPrivate = isPrivateChannel(channel);
    const announcementChannelId = isPrivate ? guildData.private_announcement_channel : guildData.announcement_channel;

    if (!announcementChannelId) return;

    try {
      const announcementChannel = await (newState.guild || oldState.guild)?.channels.fetch(announcementChannelId) as TextChannel;
      if (!announcementChannel) return;

      // Get the guild's custom timezone if set
      const timezone = guildData.timezone;

      if (isPrivate) {
        await handlePrivateChannelUpdate(oldState, newState, announcementChannel, timezone);
      } else {
        await handlePublicChannelUpdate(oldState, newState, announcementChannel, timezone);
      }
    } catch (error) {
      console.error('Error handling voice state update:', error);
    }
  },
}; 