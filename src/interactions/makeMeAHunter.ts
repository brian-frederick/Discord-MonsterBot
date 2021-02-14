import makeMeAHunterAction from '../actions/makeMeAHunter';
import Discord from 'discord.js';
import { Option } from '../interfaces/discordInteractions';


export default {
  name: 'makemeahunter',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    await makeMeAHunterAction.execute(channel, user.id);
    return;
  }
}
