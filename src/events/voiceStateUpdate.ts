import { Events, GuildMember, VoiceBasedChannel, VoiceState } from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import {
  buildDescriptionFromUserLines,
  buildSessionEmbed,
  getNotifyRoleMention,
  parseUserLines,
  updateUserLine,
} from '../discord/embeds';
import {
  findLatestEmbedByUser,
  sendEmbedMessage,
  updateEmbedMessage,
} from '../discord/messages';
import { logError } from '../utils/errorHandling';
import { getFormattedSessionStartMessage } from '../utils/sessionMessages';

const handleVoiceStateUpdate = async (
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> => {
  const member = newState.member || oldState.member;
  if (!member || member.user.bot) return;

  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const now = new Date();

  // User left a channel
  if (oldChannel && !newChannel) {
    await handleLeave(oldChannel, member, now);
  }

  // User joined a channel
  if (!oldChannel && newChannel) {
    await handleJoin(newChannel, member, now);
  }

  // User moved between channels
  if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
    await handleLeave(oldChannel, member, now);
    await handleJoin(newChannel, member, now);
  }
};

const handleLeave = async (
  voiceChannel: VoiceBasedChannel,
  member: GuildMember,
  now: Date
) => {
  const textChannel = getVoiceChannelTextChat(voiceChannel);
  if (!textChannel) return;

  const lastSessionMsg = await findLatestEmbedByUser(
    textChannel,
    textChannel.client.user!.id
  );
  if (!lastSessionMsg) return;

  const userLines = parseUserLines(lastSessionMsg.embeds[0]?.description);
  const updatedUserLines = updateUserLine(userLines, member.id, now, 'leave');
  const description = buildDescriptionFromUserLines(updatedUserLines);
  const embed = buildSessionEmbed(description);
  await updateEmbedMessage(lastSessionMsg, embed);
};

const handleJoin = async (
  voiceChannel: VoiceBasedChannel,
  member: GuildMember,
  now: Date
) => {
  const textChannel = getVoiceChannelTextChat(voiceChannel);
  if (!textChannel) return;

  // If channel is empty (first join), start a new session
  const otherMembers = voiceChannel.members.filter(
    (m) => m.id !== member.id && !m.user.bot
  );
  if (otherMembers.size === 0) {
    const roleMention = getNotifyRoleMention(voiceChannel.guild);
    const userLines = updateUserLine({}, member.id, now, 'join');
    const description = buildDescriptionFromUserLines(userLines);
    const content = getFormattedSessionStartMessage(
      voiceChannel.guild.id,
      roleMention
    );
    const embed = buildSessionEmbed(description);
    await sendEmbedMessage(textChannel, embed, content);
    return;
  }

  // Otherwise, update the existing session
  const lastSessionMsg = await findLatestEmbedByUser(
    textChannel,
    textChannel.client.user!.id
  );
  if (!lastSessionMsg) return;

  const userLines = parseUserLines(lastSessionMsg.embeds[0]?.description);
  const updatedUserLines = updateUserLine(userLines, member.id, now, 'join');
  const description = buildDescriptionFromUserLines(updatedUserLines);
  const embed = buildSessionEmbed(description);
  await updateEmbedMessage(lastSessionMsg, embed);
};

const executeVoiceStateUpdate = async (
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> => {
  try {
    await handleVoiceStateUpdate(oldState, newState);
  } catch (error) {
    logError('voice state update', error);
  }
};

export const voiceStateUpdateEvent = {
  name: Events.VoiceStateUpdate,
  execute: executeVoiceStateUpdate,
};
