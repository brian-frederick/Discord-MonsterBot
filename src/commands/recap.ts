import params from '../utils/params';
import recapAction from '../actions/recap';

module.exports = {
  name: 'recap',
  description: 'Provides recap of most recent session.',
  async execute(message, args) {
    const maybeRecordLimit = params.parseAllForNumber(args);
    await recapAction.execute(message.channel, maybeRecordLimit);
    return;
  }
};
