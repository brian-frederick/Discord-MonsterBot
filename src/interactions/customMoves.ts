import Discord from 'discord.js';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { Option } from '../interfaces/DiscordInteractions';
import createRollOutComeModal from '../actions/customMoves/create-roll-outcome-move';
import { getParam } from '../utils/interactionParams';
import { createSpecialMove } from '../services/specialMovesService';

export default {
  name: 'custommoves',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    const subcommand = options.find(o => o.type === 1);
    
    console.log('bftest', subcommand);
    console.log('bftest options: ', JSON.stringify(options, null, 2));
    
    if (!subcommand || subcommand.name === 'view') {
      // TODO
      return; 
    }

    if (!subcommand || subcommand.name === 'library') {
      // TODO
      return;
    }

    const moveCreationSubcommands = ['create-roll-outcome-move', 'create-simple-move', 'create-modified-move'];
    if (!subcommand || !moveCreationSubcommands.includes(subcommand.name)) {
      console.error('No move creation subcommand found. Cannot create move.', subcommand?.name);
      return;
    }

    // Handle move creation below
    const moveOptions = options[0]?.options;
    if (!moveOptions?.length || moveOptions.length < 1 ) {
      console.error('No move options found even though they are required. Cannot create move.');
      return;
    }

    const typeMap = {
      'create-roll-outcome-move': 'roll',
      'create-simple-move': 'simple',
      'create-modified-move': 'modification'
    };

    const type = typeMap[subcommand.name];
    const moveName = getParam('name', moveOptions);

    if (!type || !moveName) {
      console.error(`No move type or name found even though they are required. Cannot create move. type: ${type}, moveName: ${moveName}`);
      return;
    }

    // update move name to become a valid discord slash command name
    const key = moveName.replace(/ /g, '-');
    // \p{L} matches a Unicode code point that is a letter
    // \p{N} matches a Unicode code point that is a number
    // \p{sc=Deva} matches a Unicode code point that is a Devanagari letter
    // \p{sc=Thai} matches a Unicode code point that is a Thai letter
    // The regex matches any string that only contains letters, numbers, underscores, dashes, and these special letter sets. The string must be at least 1 and at most 32 characters long.
    const keyRegex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;
    if (!keyRegex.test(key)) {
      console.error(`Key '${key}' does not match the regex ^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`);
      return;
    }

    const commandDescription = getParam('description', moveOptions);
    const plus = getParam('plus', moveOptions);

    const move = {
      guildId: guildId,
      key,
      createdOn: new Date().getTime(),
      description: commandDescription,
      guildName: messenger.channel.guild?.name,
      modifiers: type !== 'roll' ? undefined : [{
        plus: true,
        property: plus,
        type: 'property'
      }],
      name: moveName,
      type,
      userDiscriminator: user.discriminator,
      userName: user.username,
      userId: user.id
    }

    console.log('bftest this is where we would save this move', move);

    await createSpecialMove(key, guildId, move);


    if (subcommand?.name === 'create-roll-outcome-move') {
      await createRollOutComeModal.execute(messenger, user.id, key);
      console.log('bftest this is where we would save this move', move);
      return;
    }

    if (subcommand?.name === 'create-simple-move') {
      // TODO
      return;
    }

    if (subcommand?.name === 'create-modified-move') {
      // TODO
      return;
    }

    console.log(`Could not find a corresponding action for the subcommand: ${subcommand.name}.`);
  }
}
