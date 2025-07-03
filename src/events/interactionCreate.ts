import { ChatInputCommandInteraction, Events, Interaction } from 'discord.js';
import { addNotificationRoleCommand } from '../commands/addNotificationRole';
import { changeVcNotifyRoleCommand } from '../commands/changeVcNotifyRole';
import { removeNotificationRoleCommand } from '../commands/removeNotificationRole';
import { setSessionStartMessageCommand } from '../commands/setSessionStartMessage';
import { syncVoiceStateCommand } from '../commands/syncVoiceState';
import { validateVoiceStateCommand } from '../commands/validateVoiceState';
import { registerCommands } from '../utils/commandRegistration';
import { logError, sendErrorResponse } from '../utils/errorHandling';

interface Command {
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands: Record<string, Command> = {
  'change-vc-notify-role': changeVcNotifyRoleCommand,
  'set-session-start-message': setSessionStartMessageCommand,
  'add-notification-role': addNotificationRoleCommand,
  'remove-notification-role': removeNotificationRoleCommand,
  'sync-voice-state': syncVoiceStateCommand,
  'validate-voice-state': validateVoiceStateCommand,
};

const tryRegisterCommands = async (): Promise<void> => {
  try {
    await registerCommands();
  } catch (error) {
    logError('command registration after execution', error);
  }
};

const executeInteractionCreate = async (
  interaction: Interaction
): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (!command) return;

  try {
    await command.execute(interaction);
    await tryRegisterCommands();
  } catch (error) {
    logError(`command ${interaction.commandName}`, error);
    await sendErrorResponse(interaction);
  }
};

export const interactionCreateEvent = {
  name: Events.InteractionCreate,
  execute: executeInteractionCreate,
};
