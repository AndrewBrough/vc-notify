import { Events, Guild } from 'discord.js';
import { logError } from '../utils/errorHandling';

const DEFAULT_ROLE_NAME = 'voice-notifications';

const createDefaultNotificationRole = async (guild: Guild): Promise<void> => {
  const existingRole = guild.roles.cache.find(
    (role) => role.name === DEFAULT_ROLE_NAME
  );

  if (!existingRole) {
    await guild.roles.create({
      name: DEFAULT_ROLE_NAME,
      mentionable: true,
      reason: 'VC Notify bot setup',
    });
    console.log(`Created '${DEFAULT_ROLE_NAME}' role in guild ${guild.name}`);
  }
};

const executeGuildCreate = async (guild: Guild): Promise<void> => {
  try {
    await createDefaultNotificationRole(guild);
  } catch (error) {
    logError(`guild setup ${guild.name}`, error);
  }
};

export const guildCreateEvent = {
  name: Events.GuildCreate,
  execute: executeGuildCreate,
};
