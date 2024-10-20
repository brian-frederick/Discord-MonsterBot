
const _ = require('lodash');

import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { getActiveHunter } from '../services/hunterServiceV2';
import * as hunterHelper from '../utils/hunter';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string
  ): Promise<void> {

    const maybeHunter = await getActiveHunter(userId);
    if (_.isEmpty(maybeHunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    }

    const hunter = maybeHunter!;
    const statSheetEmbed = hunterHelper.statsEmbed(hunter);
    messenger.respondWithEmbed(statSheetEmbed);

    return;
  }
}