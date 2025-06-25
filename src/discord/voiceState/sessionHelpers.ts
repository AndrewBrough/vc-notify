import { Message } from 'discord.js';

const SESSION_TIMEOUT_MS = 60 * 1000; // 1 minute

export function isSessionExpired(lastSessionMsg: Message | undefined): boolean {
  if (process.env.NODE_ENV === 'development') {
    // In dev mode, always expire to make testing easier
    return true;
  }
  if (!lastSessionMsg) return true;
  const now = Date.now();
  const lastTimestamp =
    lastSessionMsg.editedTimestamp || lastSessionMsg.createdTimestamp;
  return now - lastTimestamp > SESSION_TIMEOUT_MS;
}
