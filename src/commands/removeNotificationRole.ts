import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logError, sendErrorResponse } from '../utils/errorHandling';
import { checkBotManageRolesPermission } from '../utils/permissions';
import { validateNotificationRole } from '../utils/roleManagement';

const removeNotificationRoleData = new SlashCommandBuilder()
  .setName('remove-notification-role')
  .setDescription('Remove the VC notification role from yourself');

const removeNotificationRole = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  // Check bot permissions
  const hasPermission = await checkBotManageRolesPermission(interaction);
  if (!hasPermission) return;

  // Validate notification role exists
  const role = await validateNotificationRole(interaction);
  if (!role) return;

  // Get the member who sent the command
  const member = await interaction.guild!.members.fetch(interaction.user.id);

  // Check if user has the role
  if (!member.roles.cache.has(role.id)) {
    await interaction.reply({
      content: `You don't have the ${role.toString()} role!`,
      ephemeral: true,
    });
    return;
  }

  // Remove the role from the user
  await member.roles.remove(role);

  await interaction.reply({
    content: `Successfully removed the ${role.toString()} role from you! You will no longer receive VC notifications.`,
    ephemeral: true,
  });
};

const executeRemoveNotificationRole = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  if (!interaction.guild) return;

  try {
    await removeNotificationRole(interaction);
  } catch (error) {
    logError('remove-notification-role command', error);
    await sendErrorResponse(interaction);
  }
};

export const removeNotificationRoleCommand = {
  data: removeNotificationRoleData,
  execute: executeRemoveNotificationRole,
};
