const _ = require('lodash');
const dice = require('../utils/dice');
const ddb = require('../utils/dynamodb');
const moves = require('../utils/moves');
const movesHelper = require('../utils/movesHelper');
const moveContext = require('../content/callRickBayless');
const params = require('../utils/params');
const { someHunter } = require('../utils/hunter');
const { modifier, tag } = require('../content/commonParams');

module.exports = {
  name: 'callrickbayless',
  aliases: ['crb', 'rickroll'],
  description: `A janky custom move for chris mathew's janky move mechanic.`,
  params: [modifier, tag],
	async execute(message, args, alias) {

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    let hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send('Could not find your hunter. Rolling with some hunter.');
      hunter = someHunter;
    }

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
