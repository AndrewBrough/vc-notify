import { readJSON, writeJSON } from './helpers/jsonHelpers';

const SESSION_MESSAGES_FILE = `${import.meta.env.DISCORD_BOT_DATA_DIR}/sessionStartMessages.json`;

/**
 * Reads the session message mapping from the data file
 */
export const readSessionMessageMap = (): Record<string, string> => {
  try {
    return readJSON(SESSION_MESSAGES_FILE);
  } catch {
    return {};
  }
};

/**
 * Writes the session message mapping to the data file
 */
export const writeSessionMessageMap = (
  messageMap: Record<string, string>
): void => {
  writeJSON(SESSION_MESSAGES_FILE, '', messageMap);
};

/**
 * Gets the session start message for a guild
 */
export const getSessionStartMessage = (guildId: string): string | undefined => {
  const messageMap = readSessionMessageMap();
  return messageMap[guildId];
};

/**
 * Sets the session start message for a guild
 */
export const setSessionStartMessage = (
  guildId: string,
  message: string
): void => {
  const messageMap = readSessionMessageMap();
  messageMap[guildId] = message;
  writeSessionMessageMap(messageMap);
};

/**
 * Gets the formatted session start message with role mention
 */
export const getFormattedSessionStartMessage = (
  guildId: string,
  roleMention?: string
): string => {
  const customMessage = getSessionStartMessage(guildId);

  if (customMessage) {
    return customMessage;
  }

  return `🎤 Voice session started! ${roleMention ?? ''}`.trim();
};
