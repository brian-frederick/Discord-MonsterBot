import endSessionAction from '../actions/endSession';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'endsession',
  description: 'Runs end session questions and creates recap.',
  async execute(messenger: CommandMessenger, message) {
    await endSessionAction.execute(messenger);
    return;
  }
};
