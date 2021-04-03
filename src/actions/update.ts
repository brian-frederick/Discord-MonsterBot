import { Stat } from '../interfaces/enums';
import * as hunterHelper from '../utils/hunter';
import { updateHunterProperty } from '../services/hunterService';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(hunterId: string, stat: Stat, value: number): string {
    if (!stat) {
      return 'You must include a stat like cool, charm, tough, sharp, or weird to update.';
    }
    
    if (isNaN(value)) {
      return 'gggGGGRowwwwllll... you must include a number for us to update the stat.';
    }

    if (!hunterId) {
      return 'Blrrgh I do not know which hunter to udpate.';
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    hunterId: string,
    stat: Stat,
    value: number
  ): Promise<void> {

    console.log(`action params hunterId: ${hunterId} stat: ${stat} value: ${value}`);

    const errMsg = this.validate(hunterId, stat, value);
    if (errMsg) {
      messenger.respond(errMsg);
      return;
    }
    
    const updatedHunter = await updateHunterProperty(hunterId, stat, value);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }


    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheet);
    
    return;
  }
}
