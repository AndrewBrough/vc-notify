import { Events, Guild } from 'discord.js';

const DEFAULT_ROLE_NAME = 'voice-notifications';

export default {
  name: Events.GuildCreate,
  async execute(guild: Guild): Promise<void> {
    try {
      await createDefaultNotificationRole(guild);
    } catch (error) {
      console.error(
        `Error setting up notification role in guild ${guild.name}:`,
        error
      );
    }
  },
};

async function createDefaultNotificationRole(guild: Guild): Promise<void> {
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
}
