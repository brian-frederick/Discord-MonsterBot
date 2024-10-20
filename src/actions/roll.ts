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
    let modifiers: {key: string, value: number }[] = [];
    // will be overwritten if there's hunter stats involved
    let rollersName = username;

    if (fwd) {
      modifiers.push({ key: 'forward', value: fwd });
    }
    
    if (hunterProperty) {
      let maybeHunter = await getActiveHunter(hunterId);
      if (_.isEmpty(maybeHunter)) {
        messenger.channel.send('Could not find your hunter. Rolling with some hunter.')
        maybeHunter = someHunter;
      }

      const hunter = maybeHunter!;
      rollersName = hunter.firstName;
      modifiers.push({ key: hunterProperty, value: hunter[hunterProperty]})
    }

    const outcome = dice.roll(modifiers);

    messenger.respond(`${rollersName} just rolled ${outcome.total}`);
    messenger.followup(outcome.equation);
  }
}
