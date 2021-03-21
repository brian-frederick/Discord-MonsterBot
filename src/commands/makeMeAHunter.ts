import makeMeAHunterAction from '../actions/makeMeAHunter';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'makemeahunter',
  description: 'Creates a hunter for the user.',
  async execute(messenger: CommandMessenger, message) {
    await makeMeAHunterAction.execute(messenger, message.author.id);
    return;
  }
};
