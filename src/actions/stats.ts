import Discord from 'discord.js';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import ddb from '../utils/dynamodb';
const _ = require('lodash');
import * as hunterHelper from '../utils/hunter';

export default {
  async execute(
    messenger: DiscordMessenger,
    hunterId: string
  ): Promise<void> {

    const hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    const statSheetEmbed = hunterHelper.statsEmbed(hunter);
    messenger.respondWithEmbed(statSheetEmbed);

    return;
  }
}