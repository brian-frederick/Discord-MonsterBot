const _ = require('lodash');
const dice = require('../utils/dice');
const ddb = require('../utils/dynamodb');
const moves =  require('../utils/moves');
const movesHelper = require('../utils/movesHelper');
const params = require('../utils/params');
const specialMovesHelper = require('../utils/specialMovesHelper');
const specialMovesService = require('../services/specialMovesService');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const { tag, modifier } = require('../content/commonParams');

module.exports = {
  name: 'specialmove',
  aliases: ['secretmenu', 'sm', '!'],
  description: 'Invokes special moves.',
  params: [modifier, tag],
	async execute(message, args) {

    const moveKey = params.parseSpecialMoveKey(args);
    if (!moveKey) {
      message.channel.send('Bleep bloop Screeee! You must include a special move key.');
      return;
    }

    const moveContext = await specialMovesService.getSpecialMove(message.guild.id, moveKey);
    if (!moveContext || _.isEmpty(moveContext)) {
      message.channel.send('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    let hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send('Could not find your hunter. Rolling with some hunter.')
      hunter = someHunter;
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
    
    const isAdvanced = isMoveAdvanced(moveKey, hunter.advancedMoves);
    const outcome = dice.roll(modifiers);

    let outcomeEmbed;

    if (moveContext.type === 'modification') {
      const secondaryContext = moves[moveContext.moveToModify];
      outcomeEmbed = specialMovesHelper.createModificationMessages(hunter.firstName, outcome.total, outcome.equation, moveContext, secondaryContext, isAdvanced);
    } else {
      outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);
    }
    
    message.channel.send({ embed: outcomeEmbed });
	}
};
