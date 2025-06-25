import { Guild } from 'discord.js';
import { existsSync, readFileSync } from 'fs';

const ROLE_DATA_FILE = './data/vcNotifyRoles.json';
const DEFAULT_ROLE_NAME = 'voice-notifications';

function readRoleMap(): Record<string, string> {
  if (!existsSync(ROLE_DATA_FILE)) return {};
  return JSON.parse(readFileSync(ROLE_DATA_FILE, 'utf-8'));
}

export function getNotifyRoleMention(guild: Guild): string | undefined {
  // First, try to get the role by ID (from the change-vc-notify-role command)
  const roleMap = readRoleMap();
  const roleId = roleMap[guild.id];
  let role = roleId ? guild.roles.cache.get(roleId) : undefined;

  // Fallback to default role names if no custom role is set
  if (!role) {
    role = guild.roles.cache.find(
      (r) =>
        r.name === DEFAULT_ROLE_NAME ||
        r.name === 'birds' ||
        r.name === 'vc-notifications'
    );
  }

  return role ? `<@&${role.id}>` : undefined;
}
