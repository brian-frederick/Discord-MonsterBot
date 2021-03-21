import { MoveType } from '../interfaces/enums';
import Discord from 'discord.js';
import { Option } from './DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import moveAction from '../actions/move';

export class BasicMove {
  moveKey: MoveType;

  constructor(key: MoveType) {
    this.moveKey = key;
  }

  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: Option[] = []) {
    let forward: number;
    let hunterId: string;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      const forwardParam = getParam('forward', options);
      forward = parseInt(forwardParam);
    }

    await moveAction.execute(channel, hunterId, this.moveKey, forward);

    return;
  }
}