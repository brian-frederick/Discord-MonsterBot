import { MoveType } from '../interfaces/enums';
import Discord from 'discord.js';
import { Option } from './DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import moveAction from '../actions/move';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
export class BasicMove {
  moveKey: MoveType;

  constructor(key: MoveType) {
    this.moveKey = key;
  }

  async execute(messenger: DiscordMessenger, user: Discord.User, guildId, options: Option[] = []) {
    let forward: number | undefined = undefined;
    let hunterId: string;

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      const forwardParam = getParam('forward', options);
      forward = forwardParam ? parseInt(forwardParam) : undefined;
    }

    await moveAction.execute(messenger, hunterId, this.moveKey, forward);

    return;
  }
}