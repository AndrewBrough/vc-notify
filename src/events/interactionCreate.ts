import { ChatInputCommandInteraction, Events, Interaction } from 'discord.js';
import changeVcNotifyRole from '../commands/changeVcNotifyRole';
import setSessionStartMessage from '../commands/setSessionStartMessage';
import { registerCommands } from '../utils/commandRegistration';

interface Command {
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands: Record<string, Command> = {
  'change-vc-notify-role': changeVcNotifyRole,
  'set-session-start-message': setSessionStartMessage,
};

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName];
    if (!command) return;

    try {
      await command.execute(interaction);
      await tryRegisterCommands(interaction);
    } catch (error) {
      console.error(
        `Error executing command ${interaction.commandName}:`,
        error
      );
      await sendErrorResponse(interaction);
    }
  },
};

async function tryRegisterCommands(interaction: Interaction): Promise<void> {
  try {
    const clientId = interaction.client.user?.id;
    const token = process.env.DISCORD_BOT_TOKEN;
    if (clientId && token) {
      await registerCommands(clientId, token);
    } else {
      console.warn(
        'Client ID or bot token not set; skipping command registration.'
      );
    }
  } catch (error) {
    console.error(
      'Error re-registering commands after command execution:',
      error
    );
  }
}

async function sendErrorResponse(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const errorMessage = 'There was an error while executing this command!';

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({
      content: errorMessage,
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: errorMessage,
      ephemeral: true,
    });
  }
}
