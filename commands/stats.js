module.exports = {
  name: 'stats',
	description: 'stats',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);

    const statsEmbed = {
      color: 0x0099ff,
      title: `${hunter.firstName} ${hunter.lastName}`,
      description: `${hunter.type}\n`,
      fields: [
        {
          name: `harm: ${hunter.harm} luck: ${hunter.luck} xp: ${hunter.experience}`,
          value: `Charm: ${hunter.charm}\n`
          + `Cool: ${hunter.cool}\n`
          + `Sharp: ${hunter.sharp}\n`
          + `Tough: ${hunter.tough}\n`
          + `Weird: ${hunter.weird}\n`, 
        }
      ]
    };
    
    message.channel.send({ embed: statsEmbed });
	}
};