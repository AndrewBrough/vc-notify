import { REST, Routes } from 'discord.js';
import { commands } from '../commands';
import { config } from '../config/environment';

export const registerCommands = async (): Promise<void> => {
  const rest = new REST({ version: '10' }).setToken(config.bot.token);

  try {
    console.log(
      `🔄 Started refreshing application (/) commands for ${config.bot.name}.`
    );

    // Get the command data from all commands
    const commandData = commands.map((command) => command.data.toJSON());

    // Register commands globally
    await rest.put(Routes.applicationCommands(config.bot.clientId), {
      body: commandData,
    });

    console.log(
      `✅ Successfully reloaded application (/) commands for ${config.bot.name}.`
    );
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
};
