module.exports = {
  name: 'callrickbayless',
  aliases: ['crb', 'rickroll'],
	description: `A janky custom move for chris mathew'\ns janky move mechanic.`,
	async execute(message, args, alias) {
    const dice = require('../utils/dice');
    const ddb = require('../utils/dynamodb');
    const moves =  require('../utils/moves');
    const movesHelper = require('../utils/movesHelper');
    const moveContext = require('../content/callRickBayless');

    const hunter = await ddb.getHunter(message.author.id);

    const crb = moveContext['crb'];

    let modifiers = [{
      key: 'luck used', 
      value: -Math.abs(hunter.luck)
    }];

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }
      
    const outcome = dice.roll(modifiers);
    const outcomeMessages = movesHelper.createMessages(hunter.firstName, outcome.total, crb);
  
    message.channel.send(outcomeMessages.actionReport);
    message.channel.send(outcome.equation);
    message.channel.send({ embed: outcomeMessages.outcomeReport });
	}
};
