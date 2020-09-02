module.exports = {
  name: 'mark',
	description: 'add to experience, harm, or luck',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');
    const hunterHelper = require('../utils/hunter');

    const update = params.parseUpdateVital(args);

    if (!update) {
      message.channel.send('You must include a vital sign (experience, harm, or luck) to mark.');
    }

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    
    // dynamodb properties
    const UpdateExpression = `set ${update.key} = ${update.key} + :val`
    const ExpressionAttributeValues = {
      ":val": { "N": update.value.toString() }
    };
    
    const updatedHunter = await ddb.updateHunter(userIdInQuestion, UpdateExpression, ExpressionAttributeValues);

    if (!updatedHunter) {
      message.channel.send('Something has gone wrong! Help!');
    }

    message.channel.send(`marked ${update.key} plus ${update.value}.`);

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    
    message.channel.send({ embed: statSheet });
	}
};
