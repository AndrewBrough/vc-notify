import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logError, sendErrorResponse } from '../utils/errorHandling';
import { checkBotManageRolesPermission } from '../utils/permissions';
import { validateNotificationRole } from '../utils/roleManagement';

const addNotificationRoleData = new SlashCommandBuilder()
  .setName('add-notification-role')
  .setDescription('Add the VC notification role to yourself');

const addNotificationRole = async (
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

  // Check if user already has the role
  if (member.roles.cache.has(role.id)) {
    await interaction.reply({
      content: `You already have the ${role.toString()} role!`,
      ephemeral: true,
    });
    return;
  }

  // Add the role to the user
  await member.roles.add(role);

  await interaction.reply({
    content: `Successfully added the ${role.toString()} role to you! You will now receive VC notifications.`,
    ephemeral: true,
  });
};

const executeAddNotificationRole = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  if (!interaction.guild) return;

  try {
    await addNotificationRole(interaction);
  } catch (error) {
    logError('add-notification-role command', error);
    await sendErrorResponse(interaction);
  }
};

export const addNotificationRoleCommand = {
  data: addNotificationRoleData,
  execute: executeAddNotificationRole,
};
