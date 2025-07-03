import { addNotificationRoleCommand } from './addNotificationRole';
import { changeVcNotifyRoleCommand } from './changeVcNotifyRole';
import { removeNotificationRoleCommand } from './removeNotificationRole';
import { setSessionStartMessageCommand } from './setSessionStartMessage';
import { syncVoiceStateCommand } from './syncVoiceState';
import { validateVoiceStateCommand } from './validateVoiceState';

export const commands = [
  changeVcNotifyRoleCommand,
  setSessionStartMessageCommand,
  addNotificationRoleCommand,
  removeNotificationRoleCommand,
  syncVoiceStateCommand,
  validateVoiceStateCommand,
];

export {
    addNotificationRoleCommand,
    changeVcNotifyRoleCommand,
    removeNotificationRoleCommand,
    setSessionStartMessageCommand,
    syncVoiceStateCommand,
    validateVoiceStateCommand
};

export default commands;
