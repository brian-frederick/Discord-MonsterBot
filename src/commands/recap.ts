import params from '../utils/params';
import recapAction from '../actions/recap';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'recap',
  description: 'Provides recap of most recent session.',
  async execute(messenger: CommandMessenger, message, args) {
    const maybeRecordLimit = params.parseAllForNumber(args);
    await recapAction.execute(messenger, maybeRecordLimit);
    return;
  }
};
