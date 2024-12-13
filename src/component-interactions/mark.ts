import Discord from 'discord.js';
import markAction from '../actions/mark';
import { ButtonCustomIdNames, Vital } from '../interfaces/enums';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { parseCustomIdParams } from '../utils/componentInteractionParams';
import { parseAllForNumber, parseAllForVital } from '../utils/params';

export default {
  name: `${ButtonCustomIdNames.mark}`,
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User) {
    let vital: Vital | undefined;
    let value: number | undefined; 

    const hunterId = user.id;

    const params = parseCustomIdParams(customId);
    vital = params ? parseAllForVital(params) : undefined;
    value = params ? parseAllForNumber(params) : undefined;

    await markAction.execute(messenger, hunterId, vital, value);

    return;
  }
}
