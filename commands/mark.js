module.exports = {
  name: 'mark',
	description: 'add to experience, harm, or luck',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');

    const update = params.parseUpdateProperty(args);

    if (!update) {
      message.channel.send('You must include a property (experience, harm, or luck) to mark.');
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

    message.channel.send(`${update.key} marked plus ${update.value}.`);

    const statsEmbed = {
      color: 0x0099ff,
      title: `${updatedHunter.firstName} ${updatedHunter.lastName}`,
      description: `${updatedHunter.type}\n`,
      fields: [
        {
          name: `harm: ${updatedHunter.harm} luck: ${updatedHunter.luck} xp: ${updatedHunter.experience}`,
          value: `Charm: ${updatedHunter.charm}\n`
          + `Cool: ${updatedHunter.cool}\n`
          + `Sharp: ${updatedHunter.sharp}\n`
          + `Tough: ${updatedHunter.tough}\n`
          + `Weird: ${updatedHunter.weird}\n`, 
        }
      ]
    };
    
    message.channel.send({ embed: statsEmbed });
	}
};
