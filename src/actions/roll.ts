import _ from 'lodash';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { getActiveHunter } from '../services/hunterServiceV2';
import dice from '../utils/dice';
import { someHunter } from '../utils/hunter';
import { Stat } from '../interfaces/enums';

export default {
  async execute(
    messenger: DiscordMessenger,
    hunterId: string,
    username: string,
    fwd?: number,
    hunterProperty?: Stat,
  ): Promise<void> {
    let modifiers = [];
    // will be overwritten if there's hunter stats involved
    let rollersName = username;

    if (fwd) {
      modifiers.push({ key: 'forward', value: fwd });
    }
    
    if (hunterProperty) {
      let hunter = await getActiveHunter(hunterId);
      if (_.isEmpty(hunter)) {
        messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
        hunter = someHunter;
      }
      rollersName = hunter.firstName;
      modifiers.push({ key: hunterProperty, value: hunter[hunterProperty]})
    }

    const outcome = dice.roll(modifiers);

    messenger.respond(`${rollersName} just rolled ${outcome.total}`);
    messenger.followup(outcome.equation);
  }
}
