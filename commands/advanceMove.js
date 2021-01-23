const { DynamoDB } = require('aws-sdk');
const { tag } = require('../content/commonParams');
const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const hunterHelper = require('../utils/hunter');
const specialMovesService = require('../services/specialMovesService');

module.exports = {
  name: 'advancemove',
  aliases: ['advance', 'adv'],
  description: 'Allows for advanced outcome of a move.',
  params: [
    { 
      name: '- Key (text) (required)', 
      value: "The key of the move to advance as part of a hunter improvement. Such as `ksa`, `aup`, `ho`, `iam`, `ms`, `ps`, `rabs`, `um` or the key for a special move."
    },
    { 
      name: '- Remove (text)', 
      value: "With the text `remove`, `minus`, or `-`, the inputted key will be removed if present."
    },
    tag
  ],
	async execute(message, args) {

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send("Could not find your hunter!");
      return;
    }

    const advancedMoves = hunter.advancedMoves ? hunter.advancedMoves : [];

    // Do we just need to remove something here?
    if (params.isRemove(args)) {
      const keyToRemove = params.parseBasicMoveKey(args) ? params.parseBasicMoveKey(args).key : params.parseSpecialMoveKey(args);
      const i = advancedMoves.findIndex(i => i.key === keyToRemove);
      if (i < 0) {
        message.channel.send(`Blrgh! Cannot find an advanced move with the key of ${keyToRemove}.`);
        return;
      }
      advancedMoves.splice(i, 1);
    } else { // Ok, it's not a remove. We need to add something.
      let moveToAdvance = params.parseBasicMoveKey(args);
  
      // No basic move associated with the key. Let's check Special Moves.
      if (!moveToAdvance) {
        const specialMoveKey = params.parseSpecialMoveKey(args);

        if (!specialMoveKey) {
          message.channel.send(`Blrgh! You must include the key of a move!`);
          return;
        }
        const specialMoveContext = await specialMovesService.getSpecialMove(message.guild.id, specialMoveKey);;
  
        if (specialMoveContext) {
          moveToAdvance = { key: specialMoveKey.toLowerCase(), value: specialMoveContext.name };
        }
      }
  
      // Hmmm doesn't look like a special move either. Let's bail.
      if (!moveToAdvance) {
        message.channel.send('BLARRR You must include the key of a move you want to advance!');
        return;
      }
      advancedMoves.push(moveToAdvance);
    }

    // We've updated the advanced moves. Just need to save it now.
    const marshalled = DynamoDB.Converter.marshall({advancedMoves});
    // dynamodb properties
    const UpdateExpression = `set advancedMoves = :val`;
    const ExpressionAttributeValues = {
      ":val": marshalled.advancedMoves,
    };
    
    const updatedHunter = await ddb.updateHunter(userIdInQuestion, UpdateExpression, ExpressionAttributeValues);

    if (!updatedHunter) {
      message.channel.send('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    message.channel.send({ embed: statSheet });
	}
};