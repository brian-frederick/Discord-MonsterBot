import Discord from 'discord.js';
import { OptionV2 } from '../interfaces/DiscordInteractions';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { getParam, getRequiredNumberParam, getRequiredStringParam } from '../utils/interactionParams';

import activate from '../actions/hunters/activate';
import create from '../actions/hunters/create';
import remove from '../actions/hunters/remove';
import view from '../actions/hunters/view';


export default {
  name: 'hunters',
  async execute(messenger: DiscordMessenger, user: Discord.User, guildId: string, options: OptionV2[] = []) {

    const subcommand = options.find(o => o.type === 1);
    
    // If they call base command just show a view of all users.
    // Also invokable with view subcommand.
    if (!subcommand || subcommand.name === 'view') {
      await view.execute(messenger, user.id);
      return;
    }

    if (subcommand.name === 'create') {
      const subcommandOptions = subcommand.options!;
      const firstName = getRequiredStringParam('first-name', subcommandOptions);
      const lastName = getParam('last-name', subcommandOptions);
      const type = getRequiredStringParam('hunter-type', subcommandOptions);
      const charm = getRequiredNumberParam('charm', subcommandOptions);
      const cool = getRequiredNumberParam('cool', subcommandOptions);
      const sharp = getRequiredNumberParam('sharp', subcommandOptions);
      const tough = getRequiredNumberParam('tough', subcommandOptions);
      const weird = getRequiredNumberParam('weird', subcommandOptions);
  
      const hunterParams = {
        firstName,
        lastName,
        type,
        charm,
        cool,
        sharp,
        tough,
        weird
      };

      await create.execute(messenger, user.id, hunterParams);
      return;
    }

    // Subcommands have nested options.
    const nestedOptions = options.length ? options[0].options : [];
    
    //Remove and Activate both require a hunterId;
    const hunterId = getParam('id', nestedOptions!);

    if (subcommand.name === 'remove') {
      await remove.execute(messenger, user.id, hunterId!);
      return;
    }

    if (subcommand.name === 'activate') {

      await activate.execute(messenger, user.id, hunterId!);
      return;
    }

    console.log(`Could not find a corresponding action for the subcommand: ${subcommand.name}.`);
  }
}
