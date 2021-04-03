import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId } from '../utils/interactionParams';
import statsAction from '../actions/stats';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'stats',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId;

    hunterId = chooseHunterId(user.id, options);
    await statsAction.execute(messenger, hunterId);

    return;
  }
}


