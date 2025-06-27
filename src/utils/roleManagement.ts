import { ChatInputCommandInteraction, Role } from 'discord.js';
import { readJSON, writeJSON } from './helpers/jsonHelpers';

const ROLE_DATA_FILE = `${import.meta.env.DISCORD_BOT_DATA_DIR}/vcNotifyRoles.json`;

/**
 * Reads the role mapping from the data file
 */
export const readRoleMap = (): Record<string, string> => {
  try {
    return readJSON(ROLE_DATA_FILE);
  } catch {
    return {};
  }
};

/**
 * Writes the role mapping to the data file
 */
export const writeRoleMap = (roleMap: Record<string, string>): void => {
  writeJSON(ROLE_DATA_FILE, '', roleMap);
};

/**
 * Gets the notification role for a guild
 */
export const getNotificationRole = (guildId: string): string | undefined => {
  const roleMap = readRoleMap();
  return roleMap[guildId];
};

/**
 * Sets the notification role for a guild
 */
export const setNotificationRole = (guildId: string, roleId: string): void => {
  const roleMap = readRoleMap();
  roleMap[guildId] = roleId;
  writeRoleMap(roleMap);
};

/**
 * Validates that a notification role exists and is accessible
 */
export const validateNotificationRole = async (
  interaction: ChatInputCommandInteraction
): Promise<Role | null> => {
  const roleId = getNotificationRole(interaction.guild!.id);

  if (!roleId) {
    await interaction.reply({
      content:
        'No notification role has been set for this server. Please ask an administrator to set one using `/change-vc-notify-role`.',
      ephemeral: true,
    });
    return null;
  }

  const role = interaction.guild!.roles.cache.get(roleId);
  if (!role) {
    await interaction.reply({
      content:
        'The notification role no longer exists. Please ask an administrator to set a new one using `/change-vc-notify-role`.',
      ephemeral: true,
    });
    return null;
  }

  return role;
};
