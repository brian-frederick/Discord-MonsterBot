import Discord from 'discord.js';
import { Option } from '../interfaces/discordInteractions';
import endSessionAction from '../actions/endSession';

export default {
  name: 'endsession',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    await endSessionAction.execute(channel);
    return;
  }
}
