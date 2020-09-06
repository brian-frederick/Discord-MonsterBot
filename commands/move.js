const { getUserFromMention } = require('../utils/params');

module.exports = {
  name: 'move',
  aliases: ['ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', 'um'],
	description: 'move',
	async execute(message, args, alias) {
    const dice = require('../utils/dice');
    const ddb = require('../utils/dynamodb');
    const moves =  require('../utils/moves');
    const movesHelper = require('../utils/movesHelper');
    const params = require('../utils/params');

    if (!alias) {
      message.channel.send('Specify a move such as ksa (Kick Some Ass), aup (Act Under Pressure), ho (help out), iam (Investigate A Mystery), ms (Manipulate Someone), ps (Protect Someone), rabs (Read A Bad Situation), um (Use Magic).');
      return;
    }

    const moveContext = moves[alias];

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);

    const modifiers = []

    moveContext.modifiers.forEach(mod => {
      modifiers.push({ key: mod.property, value: hunter[mod.property] })
    });

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }
      
    const outcome = dice.roll(modifiers);
    const outcomeMessages = movesHelper.createMessages(hunter.firstName, outcome.total, moveContext);
  
    message.channel.send(outcomeMessages.actionReport);
    message.channel.send(outcome.equation);
    message.channel.send({ embed: outcomeMessages.outcomeReport });
	}
};
