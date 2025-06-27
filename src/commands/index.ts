import { addNotificationRoleCommand } from './addNotificationRole';
import { changeVcNotifyRoleCommand } from './changeVcNotifyRole';
import { removeNotificationRoleCommand } from './removeNotificationRole';
import { setSessionStartMessageCommand } from './setSessionStartMessage';

export const commands = [
  changeVcNotifyRoleCommand,
  setSessionStartMessageCommand,
  addNotificationRoleCommand,
  removeNotificationRoleCommand,
];

export {
  addNotificationRoleCommand,
  changeVcNotifyRoleCommand,
  removeNotificationRoleCommand,
  setSessionStartMessageCommand,
};

export default commands;
