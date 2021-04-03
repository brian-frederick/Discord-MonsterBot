import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import specialMoveAction from '../actions/specialMove';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'specialmove',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId: string;
    let forward: number;
    let key: string;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      key = getParam('key', options);
      forward = parseInt(getParam('forward', options));
    }

    await specialMoveAction.execute(messenger, hunterId, key, forward);

    return;
  }
}
