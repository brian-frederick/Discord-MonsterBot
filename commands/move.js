const _ = require('lodash');
const dice = require('../utils/dice');
const ddb = require('../utils/dynamodb');
const moves =  require('../utils/moves');
const movesHelper = require('../utils/movesHelper');
const params = require('../utils/params');
const { getUserFromMention } = require('../utils/params');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const { tag, modifier } = require('../content/commonParams');

module.exports = {
  name: 'move',
  aliases: ['ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', 'um'],
  description: `Execute all basic moves. In this unique case, the command 'move' should not be used at all. Just the move key or alias.
    These include 'ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', or 'um'.`,
  params: [
    modifier,
    tag,
  ],
	async execute(message, args, alias) {

    if (!alias) {
      message.channel.send('Specify a move such as ksa (Kick Some Ass), aup (Act Under Pressure), ho (help out), iam (Investigate A Mystery), ms (Manipulate Someone), ps (Protect Someone), rabs (Read A Bad Situation), um (Use Magic).');
      return;
    }

    const moveContext = moves[alias];

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    let hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send('Could not find your hunter. Rolling with some hunter.')
      hunter = someHunter;
    }

    const modifiers = []

    moveContext.modifiers.forEach(mod => {
      modifiers.push({ key: mod.property, value: hunter[mod.property] })
    });

    if (!isNaN(args[0])) {
      const value = parseInt(args[0]);
      modifiers.push({ key: 'input', value: value });
    }
    
    // If a hunter has advanced a move, 
    // they gain access to an even better result if a 12 or more is rolled.
    const isAdvanced = isMoveAdvanced(alias, hunter.advancedMoves);

    const outcome = dice.roll(modifiers);    
    const outcomeMessages = movesHelper.createMessages(hunter.firstName, outcome.total, moveContext, isAdvanced);

    message.channel.send(`${hunter.firstName} rolls ${outcome.equation}`);
    message.channel.send(outcomeMessages.actionReport);
    message.channel.send({ embed: outcomeMessages.outcomeReport });
	}
};
