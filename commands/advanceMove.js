const { DynamoDB } = require('aws-sdk');
const { tag } = require('../content/commonParams');
const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const hunterHelper = require('../utils/hunter');

module.exports = {
  name: 'advancemove',
  aliases: ['advance', 'adv'],
  description: 'Allows for advanced outcome of a move.',
  params: [
    { 
      name: '- Key (text) (required)', 
      value: "The key of the move to advance as part of a hunter improvement. Such as `ksa`, `aup`, `ho`, `iam`, `ms`, `ps`, `rabs`, `um` or the key for a special move."
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

    // TODO: Add ability to remove an advanced move from list

    const moveToAdvance = params.parseBasicMoveKey(args);
    // TODO: still need to search for special moves here if we don't find a basic move
    if (!moveToAdvance) {
      message.channel.send('BLARRR You must include a move you want to advance!');
      return;
    }

    const advancedMoves = hunter.advancedMoves ? hunter.advancedMoves : [];

    advancedMoves.push(moveToAdvance);

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

    console.log('hunter passing in to stats embed', updatedHunter);
    
    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    message.channel.send({ embed: statSheet });
	}
};