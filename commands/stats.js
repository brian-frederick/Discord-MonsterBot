module.exports = {
  name: 'stats',
	description: 'stats',
	async execute(message, args) {
    const ddb = require('../utils/dynamodb');

    const hunter = await ddb.getHunter(message.author.id);

    const statsEmbed = {
      color: 0x0099ff,
      title: `${hunter.firstName} ${hunter.lastName}`,
      description: `${hunter.type}`,
      fields: [
        {
          name: 'charm',
          value: `${hunter.charm}`,
          inline: true,
        },
        {
          name: 'cool',
          value: `${hunter.cool}`,
          inline: true,
        },
        {
          name: 'sharp',
          value: `${hunter.sharp}`,
          inline: true,
        },
        {
          name: 'tough',
          value: `${hunter.tough}`,
          inline: true,
        },
        {
          name: 'weird',
          value: `${hunter.weird}`,
          inline: true,
        },
      ],
    };
    
    message.channel.send({ embed: statsEmbed });
	}
};