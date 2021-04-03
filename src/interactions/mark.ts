import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import markAction from '../actions/mark';
import { Vital } from '../interfaces/enums';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'mark',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let vital: Vital;
    let hunterId: string;
    let value: number;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      vital = getParam('vital', options) as Vital;
      value = parseInt(getParam('value', options));
    }

    await markAction.execute(messenger, hunterId, vital, value);

    return;
  }
}
