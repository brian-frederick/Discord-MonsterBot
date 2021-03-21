import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import specialMoveAction from '../actions/specialMove';

export default {
  name: 'specialmove',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string;
    let forward: number;
    let key: string;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      key = getParam('key', options);
      forward = parseInt(getParam('forward', options));
    }

    await specialMoveAction.execute(channel, hunterId, key, forward);

    return;
  }
}
