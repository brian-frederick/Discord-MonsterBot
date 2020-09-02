module.exports = {
  name: 'stats',
	description: 'stats',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');
    const params = require('../utils/params');
    const hunterHelper = require('../utils/hunter');

    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);

    const statSheet = hunterHelper.statsEmbed(hunter);
    
    message.channel.send({ embed: statSheet });
	}
};
