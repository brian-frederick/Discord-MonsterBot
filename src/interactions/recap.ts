import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { getParam } from '../utils/interactionParams';
import recapAction from '../actions/recap';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'recap',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let maybeRecordLimit;

    if (options.length > 0) {
      const maybeRecordLimitParam = getParam('limit', options);

      maybeRecordLimit = maybeRecordLimitParam ? parseInt(maybeRecordLimitParam) : undefined;
    }

    await recapAction.execute(messenger, maybeRecordLimit);
    return;
  }
}
