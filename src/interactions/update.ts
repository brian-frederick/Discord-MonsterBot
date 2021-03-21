import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import updateAction from '../actions/update';

export default {
  name: 'update',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let stat;
    let hunterId;
    let value;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      stat = getParam('stat', options);
      value = getParam('value', options);
    }

    await updateAction.execute(channel, hunterId, stat, value);

    return;
  }
}
