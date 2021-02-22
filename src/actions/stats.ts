import Discord from 'discord.js';
import ddb from '../utils/dynamodb';
const _ = require('lodash');
import * as hunterHelper from '../utils/hunter';

export default {
  async execute(
    channel: Discord.TextChannel,
    hunterId: string
  ): Promise<void> {

    const hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      channel.send("Could not find your hunter!");
      return;
    }

    const statSheet = hunterHelper.statsEmbed(hunter);
    channel.send({embed: statSheet});

    return;
  }
}