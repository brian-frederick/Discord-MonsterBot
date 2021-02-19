import Discord from 'discord.js';
import { Option } from '../interfaces/discordInteractions';
import { getParam } from '../utils/interactionParams';
import infoAction from '../actions/info';

export default {
  name: 'info',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let maybeBasicMoveKey: string;
    let maybeSpecialMoveKey: string | undefined;

    if (options.length > 0) {
      maybeBasicMoveKey = getParam('basicmove', options);
      maybeSpecialMoveKey = getParam('specialmovekey', options);
    }

    await infoAction.execute(channel, maybeBasicMoveKey, maybeSpecialMoveKey);

    return null;
  }
}
