import makeMeAHunterAction from '../actions/makeMeAHunter';
import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'makemeahunter',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    await makeMeAHunterAction.execute(messenger, user.id);
    return;
  }
}
