const _ = require('lodash');
const { tag } = require('../content/commonParams');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const hunterHelper = require('../utils/hunter');

module.exports = {
  name: 'stats',
  description: 'Provides hunter stats.',
  params: [tag],
	async execute(message, args) {
    const userIdFromMention = params.checkAllArgs(args, params.parseUserIdFromMentionParam);
    const userIdInQuestion = userIdFromMention ? userIdFromMention : message.author.id;
    const hunter = await ddb.getHunter(userIdInQuestion);
    if (_.isEmpty(hunter)) {
      message.channel.send("Could not find your hunter!");
      return;
    }

    const statSheet = hunterHelper.statsEmbed(hunter);
    
    message.channel.send({ embed: statSheet });
	}
};
