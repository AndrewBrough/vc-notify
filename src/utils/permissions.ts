import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

/**
 * Checks if the bot has the Manage Roles permission
 */
export const checkBotManageRolesPermission = async (
  interaction: ChatInputCommandInteraction
): Promise<boolean> => {
  const hasPermission = interaction.guild!.members.me?.permissions.has(
    PermissionFlagsBits.ManageRoles
  );

  if (!hasPermission) {
    await interaction.reply({
      content: 'I need the Manage Roles permission to do this!',
      ephemeral: true,
    });
  }

  return !!hasPermission;
};

/**
 * Checks if a user has the Manage Roles permission
 */
export const checkUserManageRolesPermission = async (
  interaction: ChatInputCommandInteraction
): Promise<boolean> => {
  const member = await interaction.guild!.members.fetch(interaction.user.id);
  const hasPermission = member.permissions.has(PermissionFlagsBits.ManageRoles);

  if (!hasPermission) {
    await interaction.reply({
      content: 'You need Manage Roles permission to use this command.',
      ephemeral: true,
    });
  }

  return hasPermission;
};

/**
 * Validates both user and bot have Manage Roles permission
 */
export const validateManageRolesPermissions = async (
  interaction: ChatInputCommandInteraction
): Promise<boolean> => {
  const userHasPermission = await checkUserManageRolesPermission(interaction);
  if (!userHasPermission) return false;

  const botHasPermission = await checkBotManageRolesPermission(interaction);
  if (!botHasPermission) return false;

  return true;
};
