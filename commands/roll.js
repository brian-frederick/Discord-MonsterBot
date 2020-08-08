module.exports = {
	name: 'roll',
	description: 'roll',
	execute(message, args) {
    const dice = require('../utils/dice');
    const modifiers = [];

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }

    const outcome = dice.roll(modifiers);

    message.channel.send(`${message.author.username} just rolled a ${outcome.total}`);
    message.channel.send(outcome.equation);
	}
};
