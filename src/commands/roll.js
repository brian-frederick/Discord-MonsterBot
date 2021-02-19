const dice = require('../utils/dice');
const { modifier } = require('../content/commonParams');

module.exports = {
	name: 'roll',
  description: 'Just rolls two d6.',
  params: [modifier],
	execute(message, args) {
    const modifiers = [];

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }

    const outcome = dice.roll(modifiers);

    message.channel.send(`${message.author.username} just rolled ${outcome.total}`);
    message.channel.send(outcome.equation);
	}
};
