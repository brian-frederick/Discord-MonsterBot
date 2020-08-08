const { MessageFlags } = require('discord.js');

module.exports = {
  name: 'move',
  aliases: ['ksa', 'uap', 'ho', 'iam', 'ms', 'ps', 'rabs', 'um'],
	description: 'move',
	async execute(message, args, alias) {
    const dice = require('../utils/dice');
    const ddb = require('../utils/dynamodb');
    const moves =  require('../utils/moves');
    const movesHelper = require('../utils/movesHelper');

    if (!alias) {
      message.channel.send('Specify a move such as ksa, uap, ho, iam, ms, ps, rabs, um.');
      return;
    }

    const moveContext = moves[alias];

    const modifierName = moveContext.modifier;

    const keeper = await ddb.getKeeper(message.author.id);
      
    const diceRolls = dice.roll2d6();

    const modifiers = [{name: modifierName, value: keeper[modifierName]}];

    console.log('modifiers', modifiers);
  
    const modifiedRoll = dice.makeOutcomeWithModifierArgs(diceRolls, args);

    const outcomeMessages = movesHelper.createMessages(keeper.FirstName, modifiedRoll.total, moveContext);
  
    message.channel.send(outcomeMessages.actionReport);
    message.channel.send(modifiedRoll.equation);
    message.channel.send(outcomeMessages.outcomeReport);
	}
};
