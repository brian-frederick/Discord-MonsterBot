module.exports = {
  name: 'callrickbayless',
  aliases: ['crb', 'rickroll'],
	description: `A janky custom move for chris mathew'\ns janky move mechanic.`,
	async execute(message, args, alias) {
    const dice = require('../utils/dice');
    const ddb = require('../utils/dynamodb');
    const moves =  require('../utils/moves');
    const movesHelper = require('../utils/movesHelper');

    const hunter = await ddb.getHunter(message.author.id);

    const crbQuestions = ` - Where are they now?\n`
      + ` - What happens here?\n`
      + ` - What's about to happen?\n`
      + ` - Who should I look for?\n`
      + ` - Where should I go?\n`
      + ` - What does the arcane almanac say?\n`;

    const crb = {
      name: 'call Rick Bayless',
      action: 'called Rick Bayless',
      modifier: 'sharp',
      outcome: {
        fail: {
          title: 'On a failure',
          description: 'You make an attention-attracting fail.',
          image: {
            url: 'https://media.giphy.com/media/lgcUUCXgC8mEo/giphy.gif'
          },
          footer: {
            text: `Maaaarrk that experience.`
          }
        },
        success: {
          title: 'On a 7-9 Call Rick Bayless, hold 1.',
          description: `One hold can be spent to ask Rick Bayless one of the following questions:\n` + crbQuestions
        },
        high: {
          title: 'On a 10+ Call Rick Bayless, hold 2',
          description: `Hold 2. One hold can be spent to ask Rick Bayless one of the following questions:\n` + crbQuestions
        },
        advanced: {
          title: 'On a 12+ Call Rick Bayless',
          description: `You may ask Rick Bayless any question you want about the mystery, not just the listed ones.\n` + crbQuestions
        }
      }
    };

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
