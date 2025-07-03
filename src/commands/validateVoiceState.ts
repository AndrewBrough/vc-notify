import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import { logError } from '../utils/errorHandling';
import { logStateValidation, validateAllVoiceChannels } from '../utils/stateValidation';

export const validateVoiceStateCommand = {
  data: new SlashCommandBuilder()
    .setName('validate-voice-state')
    .setDescription('Validate all voice channel states for inconsistencies')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      if (!guild) {
        await interaction.editReply('❌ This command can only be used in a server.');
        return;
      }

      console.log(`🔍 Validation requested by ${interaction.user.tag} for guild ${guild.name}`);

      // Validate all voice channels
      const results = await validateAllVoiceChannels(guild);
      
      // Log results to console for debugging
      logStateValidation(results);

      // Count issues
      const totalIssues = results.reduce((sum, result) => sum + result.issues.length, 0);
      const inconsistentChannels = results.filter(result => !result.isConsistent);

      // Build response message
      let response = `🔍 **Voice Channel State Validation Results**\n\n`;
      response += `📊 **Summary:** ${totalIssues} issues found across ${results.length} channels\n\n`;

      if (inconsistentChannels.length === 0) {
        response += `✅ **All channels are consistent!**\n`;
      } else {
        response += `❌ **Inconsistent Channels:**\n`;
        
        for (const result of inconsistentChannels) {
          response += `\n📢 **${result.channel.name}**\n`;
          response += `   • Text Channel: ${result.textChannel || 'None'}\n`;
          response += `   • Session Message: ${result.hasSessionMessage ? 'Yes' : 'No'}\n`;
          response += `   • Actual Members: ${result.actualMembers.length}\n`;
          response += `   • Recorded Members: ${result.recordedMembers.length}\n`;
          
          if (result.issues.length > 0) {
            response += `   • Issues: ${result.issues.join(', ')}\n`;
          }
          
          if (result.missingMembers.length > 0) {
            response += `   • Missing: ${result.missingMembers.length} members\n`;
          }
          
          if (result.extraMembers.length > 0) {
            response += `   • Extra: ${result.extraMembers.length} members\n`;
          }
        }
        
        response += `\n💡 **Tip:** Use \`/sync-voice-state\` to fix individual channels.`;
      }

      await interaction.editReply(response);

    } catch (error) {
      logError('validate voice state command', error);
      await interaction.editReply('❌ An error occurred while validating voice states.');
    }
  },
}; 