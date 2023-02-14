import menuAction from '../actions/menu';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  name: 'menu',
  async execute(messenger: DiscordMessenger) {

    await menuAction.execute(messenger);

    return;
  }
}