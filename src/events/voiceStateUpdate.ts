import { PermissionFlagsBits, TextChannel, VoiceState } from 'discord.js';
import { readJSON } from '../utils/functions';

function isPrivateChannel(channel: any): boolean {
  if (!channel) return false;
  const everyoneRole = channel.guild.roles.everyone;
  return !channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.ViewChannel);
}

function isChannelChange(oldState: VoiceState, newState: VoiceState): boolean {
  return oldState.channelId !== newState.channelId;
}

async function handlePublicChannelUpdate(oldState: VoiceState, newState: VoiceState, announcementChannel: TextChannel) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    await announcementChannel.send(
      `${newState.member?.displayName} joined ${newState.channel.name} at ${joinTime}`
    );
  }
}

async function handlePrivateChannelUpdate(oldState: VoiceState, newState: VoiceState, announcementChannel: TextChannel) {
  if (newState.channel && oldState.channelId !== newState.channelId) {
    const joinTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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

      if (isPrivate) {
        await handlePrivateChannelUpdate(oldState, newState, announcementChannel);
      } else {
        await handlePublicChannelUpdate(oldState, newState, announcementChannel);
      }
    } catch (error) {
      console.error('Error handling voice state update:', error);
    }
  },
}; 