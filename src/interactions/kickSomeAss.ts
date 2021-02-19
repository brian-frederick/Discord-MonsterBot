import Discord from 'discord.js';
import { Option } from '../interfaces/discordInteractions';
import { MoveType } from '../interfaces/enums';
import { BasicMove } from '../interfaces/move';

export default {
  name: 'kicksomeass',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    const move = new BasicMove(MoveType.KickSomeAss);
    await move.execute(channel, user, guildId, options);
    return;
  }
}
