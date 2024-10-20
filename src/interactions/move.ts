import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { chooseHunterId, getParam } from '../utils/interactionParams';
import moveAction from '../actions/move';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'move',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    let moveKey: string | undefined = undefined;
    let forward: number | undefined = undefined;
    let hunterId: string;
    
    console.log('user', user);
    console.log('options', options);

    hunterId = chooseHunterId(user.id, options);
    if (options.length > 0) {
      moveKey = getParam('move', options);
      const forwardParam = getParam('forward', options);
      forward = forwardParam ? parseInt(forwardParam) : undefined;
    }

    console.log(`move params - moveKey: ${moveKey}, forward: ${forward}, hunterId: ${hunterId} `);

    await moveAction.execute(messenger, hunterId, moveKey, forward);

    return;
  }
}

