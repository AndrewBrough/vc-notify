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

// Main event handler for voice state updates
export default {
  name: Events.VoiceStateUpdate,
  async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
    try {
      await handleVoiceStateUpdate(oldState, newState);
    } catch (error) {
      console.error('Error in voice state update:', error);
    }
  },
};

async function handleVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> {
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

  await updateExistingSession(
    lastSessionMsg,
    voiceChannel,
    member,
    joined,
    left,
    now
  );
}

function isChannelEmpty(newState: VoiceState): boolean {
  const otherMembers = newState.channel!.members.filter(
    (member) => member.id !== newState.id && !member.user.bot
  );
  return otherMembers.size === 0;
}

async function startNewSession(
  voiceChannel: VoiceBasedChannel,
  member: GuildMember,
  now: Date,
  textChannel: TextChannel
): Promise<void> {
  const roleMention = getNotifyRoleMention(voiceChannel.guild);
  console.log('roleMention', roleMention);
  const userLines = updateUserLine({}, member.id, now, 'join');
  const description = buildDescriptionFromUserLines(userLines, roleMention);
  const embed = buildSessionEmbed(voiceChannel.name, description);
  await sendEmbedMessage(textChannel, embed, roleMention);
}

async function updateExistingSession(
  lastSessionMsg: Message | undefined,
  voiceChannel: VoiceBasedChannel,
  member: GuildMember,
  joined: boolean,
  left: boolean,
  now: Date
): Promise<void> {
  if (!lastSessionMsg) return;

  let userLines = parseUserLines(lastSessionMsg.embeds[0]?.description);

  if (joined) {
    userLines = updateUserLine(userLines, member.id, now, 'join');
  } else if (left) {
    userLines = updateUserLine(userLines, member.id, now, 'leave');
  }

  const description = buildDescriptionFromUserLines(userLines);
  const embed = buildSessionEmbed(voiceChannel.name, description);
  await updateEmbedMessage(lastSessionMsg, embed);
}
