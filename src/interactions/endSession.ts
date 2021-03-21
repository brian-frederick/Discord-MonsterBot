import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import endSessionAction from '../actions/endSession';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'endsession',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    await endSessionAction.execute(messenger);
    return;
  }
}
