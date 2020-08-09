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

    const hunter = await ddb.getHunter(message.author.id);

    let modifiers = [{
      key: moveContext.modifier, 
      value: hunter[moveContext.modifier]
    }];

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }
      
    const outcome = dice.roll(modifiers);
    const outcomeMessages = movesHelper.createMessages(hunter.firstName, outcome.total, moveContext);
  
    message.channel.send(outcomeMessages.actionReport);
    message.channel.send(outcome.equation);
    message.channel.send(outcomeMessages.outcomeReport);
	}
};
