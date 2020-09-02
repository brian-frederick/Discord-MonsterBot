module.exports = {
  name: 'update',
	description: 'Update stats like cool, charm, tough, sharp, weird',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');
    const hunterHelper = require('../utils/hunter');

    const update = params.parseUpdateProperty(args);

    if (!update) {
      message.channel.send('You must include a stat like cool, charm, tough, sharp, or weird to mark.');
      return;
    }

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    
    // dynamodb properties
    const UpdateExpression = `set ${update.key} = :val`
    const ExpressionAttributeValues = {
      ":val": { "N": update.value.toString() }
    };
    
    const updatedHunter = await ddb.updateHunter(userIdInQuestion, UpdateExpression, ExpressionAttributeValues);

    if (!updatedHunter) {
      message.channel.send('Something has gone wrong! Help!');
      return;
    }

    message.channel.send(`updated ${update.key} to ${update.value}.`);

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    
    message.channel.send({ embed: statSheet });
	}
};
