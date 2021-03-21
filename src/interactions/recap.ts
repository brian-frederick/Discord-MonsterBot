import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { getParam } from '../utils/interactionParams';
import recapAction from '../actions/recap';

export default {
  name: 'recap',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let maybeRecordLimit;

    if (options.length > 0) {
      maybeRecordLimit = parseInt(getParam('number', options));
    }

    await recapAction.execute(channel, maybeRecordLimit);
    return;
  }
}
