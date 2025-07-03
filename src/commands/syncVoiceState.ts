import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    VoiceBasedChannel,
} from 'discord.js';
import { getVoiceChannelTextChat } from '../discord/channels';
import {
    buildDescriptionFromUserLines,
    buildSessionEmbed,
    getNotifyRoleMention,
    updateUserLine
} from '../discord/embeds';
import {
    findLatestEmbedByUser,
    sendEmbedMessage,
    updateEmbedMessage,
} from '../discord/messages';
import { logError } from '../utils/errorHandling';
import { getFormattedSessionStartMessage } from '../utils/sessionMessages';

export const syncVoiceStateCommand = {
  data: new SlashCommandBuilder()
    .setName('sync-voice-state')
    .setDescription('Manually synchronize voice channel state for debugging')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Voice channel to sync (optional, defaults to your current channel)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      if (!guild) {
        await interaction.editReply('❌ This command can only be used in a server.');
        return;
      }

      // Get the target voice channel
      let targetChannel: VoiceBasedChannel | null = null;
      const channelOption = interaction.options.getChannel('channel');
      
      if (channelOption) {
        // Check if it's a voice-based channel by checking the type
        if (channelOption.type !== 2 && channelOption.type !== 13) { // 2 = GuildVoice, 13 = GuildStageVoice
          await interaction.editReply('❌ The specified channel is not a voice channel.');
          return;
        }
        targetChannel = channelOption as VoiceBasedChannel;
      } else {
        // Check if the user is in a voice channel
        const member = interaction.member;
        if (member && 'voice' in member && member.voice.channel) {
          targetChannel = member.voice.channel;
        } else {
          await interaction.editReply('❌ Please specify a voice channel or join one first.');
          return;
        }
      }

      if (!targetChannel) {
        await interaction.editReply('❌ No voice channel found.');
        return;
      }

      const textChannel = getVoiceChannelTextChat(targetChannel);
      if (!textChannel) {
        await interaction.editReply(`❌ No associated text channel found for ${targetChannel.name}.`);
        return;
      }

      // Get current voice channel state
      const nonBotMembers = targetChannel.members.filter(m => !m.user.bot);
      const now = new Date();

      console.log(`🔄 Manual sync requested for ${targetChannel.name} by ${interaction.user.tag}`);
      console.log(`📊 Current members: ${nonBotMembers.size}`, 
        nonBotMembers.map(m => m.user.tag).join(', '));

      // Find existing session message
      const lastSessionMsg = await findLatestEmbedByUser(
        textChannel,
        textChannel.client.user!.id
      );

      if (nonBotMembers.size === 0) {
        // Channel is empty, delete any existing session message
        if (lastSessionMsg) {
          await lastSessionMsg.delete();
          console.log(`🗑️ Deleted empty session message for ${targetChannel.name}`);
        }
        await interaction.editReply(`✅ Synchronized ${targetChannel.name} - channel is empty.`);
        return;
      }

      // Build new user lines from current state
      let userLines: Record<string, string> = {};
      
      for (const [memberId, member] of nonBotMembers) {
        userLines = updateUserLine(userLines, memberId, now, 'join');
      }

      const description = buildDescriptionFromUserLines(userLines);
      const embed = buildSessionEmbed(description);

      if (!lastSessionMsg) {
        // Create new session message
        const roleMention = getNotifyRoleMention(guild);
        const content = getFormattedSessionStartMessage(guild.id, roleMention);
        await sendEmbedMessage(textChannel, embed, content);
        console.log(`📝 Created new session message for ${targetChannel.name}`);
      } else {
        // Update existing session message
        await updateEmbedMessage(lastSessionMsg, embed);
        console.log(`📝 Updated existing session message for ${targetChannel.name}`);
      }

      await interaction.editReply(
        `✅ Successfully synchronized ${targetChannel.name} with ${nonBotMembers.size} members:\n` +
        nonBotMembers.map(m => `• ${m.user.tag}`).join('\n')
      );

    } catch (error) {
      logError('sync voice state command', error);
      await interaction.editReply('❌ An error occurred while synchronizing the voice state.');
    }
  },
}; 