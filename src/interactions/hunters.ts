import Discord from 'discord.js';
import { Option } from '../interfaces/DiscordInteractions';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { getParam } from '../utils/interactionParams';

import activate from '../actions/hunters/activate';
import create from '../actions/hunters/create';
import remove from '../actions/hunters/remove';
import view from '../actions/hunters/view';


export default {
  name: 'hunters',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId: string, options: Option[] = []) {

    const subcommand = options.find(o => o.type === 1);
    
    // If they call base command just show a view of all users.
    // Also invokable with view subcommand.
    if (!subcommand || subcommand.name === 'view') {
      await view.execute(messenger, user.id);
      return;
    }

    if (subcommand.name === 'create') {
      await create.execute(messenger, user.id);
      return;
    }

    // Subcommands have nested options.
    const nestedOptions = options.length ? options[0].options : [];
    //Remove and Activate both require a hunterId;
    const hunterId = getParam('id', nestedOptions);

    if (subcommand.name === 'remove') {
      await remove.execute(messenger, user.id, hunterId);
      return;
    }

    if (subcommand.name === 'activate') {

      await activate.execute(messenger, user.id, hunterId);
      return;
    }

    console.log(`Could not find a corresponding action for the subcommand: ${subcommand.name}.`);
  }
}
