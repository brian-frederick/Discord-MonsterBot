import makeMeAHunterAction from '../actions/makeMeAHunter';

module.exports = {
  name: 'makemeahunter',
  description: 'Creates a hunter for the user.',
  async execute(message) {
    await makeMeAHunterAction.execute(message.channel, message.author.id);
    return;
  }
};
