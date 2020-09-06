const { getUserFromMention } = require('../utils/params');
const dice = require('../utils/dice');
const ddb = require('../utils/dynamodb');
const moves =  require('../utils/moves');
const movesHelper = require('../utils/movesHelper');
const params = require('../utils/params');
const move = require('./move');
const specialMovesHelper = require('../utils/specialMovesHelper');
const _ = require('lodash');

module.exports = {
  name: 'specialmove',
  aliases: ['secretmenu', 'sm', '!'],
	description: 'special moves',
	async execute(message, args) {

    const moveKey = params.parseSpecialMoveKey(args);
    if (!moveKey) {
      message.channel.send('Bleep bloop Screeee! You must include a special move key.');
      return;
    }

    const moveContext = await ddb.getMove(moveKey);
    if (!moveContext || _.isEmpty(moveContext)) {
      message.channel.send('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);
    if (!hunter) {
      message.channel.send('KRRRR-- hoooowwwllll! Could not find a hunter to use.');
      return;
    }

    if (moveContext.type === 'simple') {
      const simpleEmbed = specialMovesHelper.createSimpleEmbed(hunter.firstName, moveContext);
      message.channel.send(simpleEmbed);
      return;
    }

    const modifiers = []

    moveContext.modifiers.forEach(mod => {
      let modifierToAdd;

      if (mod.type === 'property') {
        modifierToAdd = mod.plus ? 
          { key: mod.property, value: hunter[mod.property] } : 
          { key: mod.property, value: -hunter[mod.property] };
      }

      if (mod.type === 'extra') {
        modifierToAdd = mod.plus ? 
          { key: mod.type, value: mod.value } : 
          { key: mod.type, value: -mod.value };
      }

      modifiers.push(modifierToAdd);
    });

    const maybeInputMod = params.parseAllForNumber(args);
    if (maybeInputMod) {
      modifiers.push({ key: 'input', value: maybeInputMod });
    }
      
    const outcome = dice.roll(modifiers);

    let outcomeMessages;

    if (moveContext.type === 'modification') {
      const secondaryContext = moves[moveContext.moveToModify];
      outcomeMessages = specialMovesHelper.createModificationMessages(hunter.firstName, outcome.total, moveContext, secondaryContext);
    } else {
      outcomeMessages = movesHelper.createMessages(hunter.firstName, outcome.total, moveContext);
    }

    message.channel.send(outcomeMessages.actionReport);
    message.channel.send(outcome.equation);
    message.channel.send({ embed: outcomeMessages.outcomeReport });
	}
};
