import { REST, Routes } from 'discord.js';
import commands from '../commands';

export async function registerCommands(clientId: string, token: string) {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    // Get the command data from all commands
    const commandData = commands.map((command) => command.data.toJSON());

    // Register commands globally
    await rest.put(Routes.applicationCommands(clientId), { body: commandData });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}
