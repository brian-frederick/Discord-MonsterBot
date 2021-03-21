import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { MoveType } from '../interfaces/enums';
import { BasicMove } from '../interfaces/move';

export default {
  name: 'manipulatesomeone',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    const move = new BasicMove(MoveType.ManipulateSomeone);
    await move.execute(channel, user, guildId, options);
    return;
  }
}
