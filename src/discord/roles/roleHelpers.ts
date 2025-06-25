import { Guild } from 'discord.js';
import { existsSync, readFileSync } from 'fs';

const DATA_FILE = './data/vcNotifyRoles.json';

function readRoleMap(): Record<string, string> {
  if (!existsSync(DATA_FILE)) return {};
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

export function getNotifyRoleMention(guild: Guild): string | undefined {
  const map = readRoleMap();
  const roleId = map[guild.id];
  let role = roleId ? guild.roles.cache.get(roleId) : undefined;
  if (!role) {
    // fallback to "birds"
    role = guild.roles.cache.find((r) => r.name === 'birds');
  }
  return role ? `<@&${role.id}>` : undefined;
}
