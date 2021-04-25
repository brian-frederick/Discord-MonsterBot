const _ = require('lodash');
import * as hunterHelper from '../utils/hunter';
import { Vital } from '../interfaces/enums';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(userId: string, vital: Vital, value: number): string {
    if (!vital) {
      return 'You must include a vital - experience, luck, or harm to add to.';
    }
    
    if (isNaN(value)) {
      return 'gggGGGRowwwwllll... you must include a number for us to add to the vital.';
    }

    if (!userId) {
      return 'Blrrgh I do not know which hunter to udpate.';
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    userId: string,
    vital: Vital,
    value: number,
  ): Promise<void> {

    // if no value provided, default to 1.
    const vitalValue = !isNaN(value) ? value : 1;

    const errMsg = this.validate(userId, vital, vitalValue);
    if (errMsg) {
      messenger.respond(errMsg);
      return;
    }

    const hunter = await getActiveHunter(userId);
    if (_.isEmpty(hunter)) {
      messenger.respond("Could not find your hunter!");
      return;
    } 
    
    const newValue = hunter[vital] + vitalValue;
    const updatedHunter = await updateHunterProperty(userId, hunter.hunterId, vital, newValue);
    if (!updatedHunter) {
      messenger.respond('Something has gone wrong! Help!');
      return;
    }

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    messenger.respondWithEmbed(statSheet);

    return;
  }
}
