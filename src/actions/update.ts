const _ = require('lodash');
import { Stat } from '../interfaces/enums';
import * as hunterHelper from '../utils/hunter';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(userId: string, stat: Stat, value: number): string {
    if (!stat) {
      return 'You must include a stat like cool, charm, tough, sharp, or weird to update.';
    }
    
    if (isNaN(value)) {
      return 'gggGGGRowwwwllll... you must include a number for us to update the stat.';
    }

    if (!userId) {
      return 'Blrrgh I do not know which hunter to udpate.';
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    userId: string,
    stat: Stat,
    value: number
  ): Promise<void> {

    console.log(`action params hunterId: ${userId} stat: ${stat} value: ${value}`);

    const errMsg = this.validate(userId, stat, value);
    if (errMsg) {
      messenger.respond(errMsg);
      return;
    }

    const hunter = await getActiveHunter(userId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    } 
    
    const updatedHunter = await updateHunterProperty(userId, hunter.hunterId, stat, value);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheet);
    
    return;
  }
}
