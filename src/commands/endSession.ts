import endSessionAction from '../actions/endSession';

module.exports = {
  name: 'endsession',
  description: 'Runs end session questions and creates recap.',
  async execute(message) {
    await endSessionAction.execute(message.channel);
    return;
  }
};
