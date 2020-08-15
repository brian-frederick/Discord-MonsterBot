module.exports = {
  name: 'update',
	description: 'Update stats like cool, charm, tough, sharp, weird',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');

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
