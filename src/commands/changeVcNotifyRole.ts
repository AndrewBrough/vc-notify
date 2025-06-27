import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from 'discord.js';
import { logError, sendErrorResponse } from '../utils/errorHandling';
import { validateManageRolesPermissions } from '../utils/permissions';
import { setNotificationRole } from '../utils/roleManagement';

const changeVcNotifyRoleData = new SlashCommandBuilder()
  .setName('change-vc-notify-role')
  .setDescription('Change the role used for VC notifications')
  .addRoleOption((option) =>
    option
      .setName('role')
      .setDescription('The role to use for notifications')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

const updateNotificationRole = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  // Validate permissions
  const hasPermissions = await validateManageRolesPermissions(interaction);
  if (!hasPermissions) return;

  const role = interaction.options.getRole('role', true) as Role;

  // Save the role ID for this guild
  setNotificationRole(interaction.guild!.id, role.id);

  await interaction.reply({
    content: `VC notification role set to ${role.toString()}. Future notifications will mention this role.`,
    ephemeral: true,
  });
};

const executeChangeVcNotifyRole = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  if (!interaction.guild) return;

  try {
    await updateNotificationRole(interaction);
  } catch (error) {
    logError('change-vc-notify-role command', error);
    await sendErrorResponse(interaction);
  }
};

export const changeVcNotifyRoleCommand = {
  data: changeVcNotifyRoleData,
  execute: executeChangeVcNotifyRole,
};
