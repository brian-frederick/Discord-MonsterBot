module.exports = {
	name: 'roll',
	description: 'roll',
	execute(message, args) {
    const dice = require('../utils/dice');

    const diceRolls = dice.roll2d6();

    const outcome = dice.makeOutcomeWithModifierArgs(diceRolls, args);

    message.channel.send(`${message.author.username} just rolled a ${outcome.total}`);
    message.channel.send(outcome.equation);
	}
};
