import Discord from 'discord.js';
import markAction from '../actions/mark';
import { Vital } from '../interfaces/enums';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { parseCustomIdParams } from '../utils/componentInteractionParams';
import { parseAllForNumber, parseAllForVital } from '../utils/params';

export default {
  name: 'mark',
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User) {
    let vital: Vital;
    let value: number; 

    const hunterId = user.id;

    const params = parseCustomIdParams(customId);
    if (params) {
        vital = parseAllForVital(params);
        value = parseAllForNumber(params);
    }

    await markAction.execute(messenger, hunterId, vital, value);

    return;
  }
}
