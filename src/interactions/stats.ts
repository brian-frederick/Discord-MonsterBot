import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId } from '../utils/interactionParams';
import statsAction from '../actions/stats';

export default {
  name: 'stats',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let hunterId;

    hunterId = chooseHunterId(user.id, options);

    await statsAction.execute(channel, hunterId);

    return;
  }
}


