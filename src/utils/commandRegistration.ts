import { REST, Routes } from 'discord.js';
import { commands } from '../commands';

export const registerCommands = async (): Promise<void> => {
  const rest = new REST({ version: '10' }).setToken(
    import.meta.env.DISCORD_BOT_TOKEN
  );

  try {
    console.log(`🔄 Started refreshing application (/) commands.`);

    // Get the command data from all commands
    const commandData = commands.map((command) => command.data.toJSON());

    // Register commands globally
    await rest.put(
      Routes.applicationCommands(import.meta.env.DISCORD_CLIENT_ID),
      {
        body: commandData,
      }
    );

    console.log(`✅ Successfully reloaded application (/) commands`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
};
