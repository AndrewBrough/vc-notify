import {
  Events,
  GuildMember,
  Message,
  TextChannel,
  VoiceBasedChannel,
  VoiceState,
} from 'discord.js';
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

  const voiceChannel = newState.channel || oldState.channel;
  if (!voiceChannel) return;

  const textChannel = getVoiceChannelTextChat(voiceChannel);
  if (!textChannel) return;

  const lastSessionMsg = await findLatestEmbedByUser(
    textChannel,
    textChannel.client.user!.id
  );

  const joined = !!newState.channel && !oldState.channel;
  const left = !!oldState.channel && !newState.channel;
  const now = new Date();

  if (joined && isChannelEmpty(newState)) {
    await startNewSession(voiceChannel, member, now, textChannel);
    return;
  }

  await updateExistingSession(lastSessionMsg, member, joined, left, now);
};

const isChannelEmpty = (newState: VoiceState): boolean => {
  const otherMembers = newState.channel!.members.filter(
    (member) => member.id !== newState.id && !member.user.bot
  );
  return otherMembers.size === 0;
};

const startNewSession = async (
  voiceChannel: VoiceBasedChannel,
  member: GuildMember,
  now: Date,
  textChannel: TextChannel
): Promise<void> => {
  const roleMention = getNotifyRoleMention(voiceChannel.guild);
  const userLines = updateUserLine({}, member.id, now, 'join');
  const description = buildDescriptionFromUserLines(userLines);
  const content = getFormattedSessionStartMessage(
    voiceChannel.guild.id,
    roleMention
  );
  const embed = buildSessionEmbed(description);

  await sendEmbedMessage(textChannel, embed, content);
};

const updateExistingSession = async (
  lastSessionMsg: Message | undefined,
  member: GuildMember,
  joined: boolean,
  left: boolean,
  now: Date
): Promise<void> => {
  if (!lastSessionMsg) return;

  const userLines = parseUserLines(lastSessionMsg.embeds[0]?.description);

  if (joined) {
    const updatedUserLines = updateUserLine(userLines, member.id, now, 'join');
    const description = buildDescriptionFromUserLines(updatedUserLines);
    const embed = buildSessionEmbed(description);
    await updateEmbedMessage(lastSessionMsg, embed);
  } else if (left) {
    const updatedUserLines = updateUserLine(userLines, member.id, now, 'leave');
    const description = buildDescriptionFromUserLines(updatedUserLines);
    const embed = buildSessionEmbed(description);
    await updateEmbedMessage(lastSessionMsg, embed);
  }
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
