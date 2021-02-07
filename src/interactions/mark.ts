import Discord from 'discord.js';
import { Option } from '../interfaces/discordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import markAction from '../actions/mark';
import { Vital } from '../interfaces/enums';

export default {
  name: 'mark',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let vital: Vital;
    let hunterId: string;
    let value: number;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      vital = getParam('vital', options) as Vital;
      value = parseInt(getParam('value', options));
    }

    await markAction.execute(channel, hunterId, vital, value);

    return;
  }
}
