import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { MoveType } from '../interfaces/enums';
import { BasicMove } from '../interfaces/move';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'readabadsituation',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    const move = new BasicMove(MoveType.ReadABadSituation);
    await move.execute(messenger, user, guildId, options);
    return;
  }
}
