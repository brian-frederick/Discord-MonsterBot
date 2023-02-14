import Discord from 'discord.js';
import moveAction from '../actions/move';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { MoveType } from '../interfaces/enums';

export default {
  name: 'move',
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User, values: string[]) {

    const hunterId = user.id;
    const moveKeyParam = values[0];
    const moveKey = moveKeyParam as MoveType;

    await moveAction.execute(messenger, hunterId, moveKey);

    return;
  }
}