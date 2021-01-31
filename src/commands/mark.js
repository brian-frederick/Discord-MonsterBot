const { tag, modifier } = require('../content/commonParams');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const hunterHelper = require('../utils/hunter');

module.exports = {
  name: 'mark',
  description: 'Adds to experience, harm, or luck. If no number is given, defaults to adding 1.',
  params: [
    modifier,
    tag,  
    { name: `- Vital ('experience', 'harm', or 'luck') (required)`, value: 'A hunter vital to increment by the corresponding modifier.'}
  ],
	async execute(message, args) {

    const update = params.parseUpdateVital(args);

    if (!update) {
      message.channel.send('You must include a vital sign (experience, harm, or luck) to mark.');
      return;
    }

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    
    // dynamodb properties
    const UpdateExpression = `set ${update.key} = ${update.key} + :val`;
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
