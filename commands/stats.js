module.exports = {
  name: 'stats',
	description: 'stats',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');

    const hunter = await ddb.getHunter(message.author.id);

    const statsEmbed = {
      color: 0x0099ff,
      title: `${hunter.firstName} ${hunter.lastName}`,
      description: `${hunter.type}\n` 
        + `Charm: ${hunter.charm}\n`
        + `Cool: ${hunter.cool}\n`
        + `Sharp: ${hunter.sharp}\n`
        + `Tough: ${hunter.tough}\n`
        + `Weird: ${hunter.weird}\n`
    };
    
    message.channel.send({ embed: statsEmbed });
	}
};