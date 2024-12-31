import Discord from 'discord.js';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { Option } from '../interfaces/DiscordInteractions';
import createMoveModalWithOutcomes from '../actions/customMoves/create-move-modal-with-outcomes';
import { getBooleanParam, getParam, getRequiredStringParam } from '../utils/interactionParams';
import { createSpecialMove, getAllSpecialMoves } from '../services/specialMovesService';
import { createInfoResponse, PUBLIC_GUILD_ID } from '../utils/specialMovesHelper';
import { ISpecialMove } from '../interfaces/ISpecialMove';
import _ from 'lodash';

function movesListEmbed(
  moves: ISpecialMove[],
  position: 'only' | 'first' | 'middle' | 'last',
  maybeSearchKey?: string) {
  const fields = moves.map((m) => { 
    return {
      name: m.name,
      value: m.description
    };
  });

  const firstEmbedTitle = maybeSearchKey ?
      `Library moves with "${maybeSearchKey}"...` :
      'Library moves';

  return {
    title: !['first', 'only'].includes(position) ?
      undefined :
      firstEmbedTitle,
    fields,
    footer: !['last', 'only'].includes(position) ?
      undefined : {
        text: 'To see detailed info about moves, narrow your search.'
      }
  };
}

export default {
  name: 'custommoves',
  async execute(messenger: DiscordMessenger,  user: Discord.User, guildId, options: Option[] = []) {
    const subcommand = options.find(o => o.type === 1);
    const subcommandOptions = subcommand?.options;
    
    if (!subcommand) {
      console.error('no subcommand present. This is unexpected.');
      return; 
    }

    if (subcommand.name === 'library') {
      const maybeSearchKey = subcommandOptions ? getParam('search', subcommandOptions) : undefined;
      console.log('maybeSearchKey', maybeSearchKey);

      const moves = await getAllSpecialMoves(PUBLIC_GUILD_ID, maybeSearchKey);

      if (!moves?.length) {
        messenger.respondV2({content: 'BLORP whimper whimper. Could not find a move by that name.'}, true);
      } else if (moves.length === 1) {
        const moveContext = moves[0];
        const [embed, components] = createInfoResponse(moveContext as ISpecialMove, user.id);
        messenger.respondV2({ embeds: [embed], components }, true);
      } 
      else if (moves.length < 5) {
        const moveContext = moves[0];
        const [embed, components] = createInfoResponse(moveContext as ISpecialMove, user.id);
        messenger.respondV2({ embeds: [embed], components }, true);
        const [,...rest] = moves;
        rest!.forEach(m => {
          const [embed, components] = createInfoResponse(m as ISpecialMove, user.id);
          messenger.followupV2({ embeds: [embed], components }, true);
        });
      } else {
        const chunkedMoves = _.chunk(moves, 10);
        const embeds = chunkedMoves.map((c,i) => {
          const position: 'only' | 'first' | 'middle' | 'last' =
            chunkedMoves.length === 1 ?
              'only' :
              i === 0 ? 
                'first' :
                  i === chunkedMoves.length - 1 ?
                    'last' :
                    'middle';

          return movesListEmbed(c as ISpecialMove[], position, maybeSearchKey)
        });

        messenger.respondV2({ embeds }, true);
        return;
      }
    }

    const moveCreationSubcommands = ['create-roll-outcome-move', 'create-simple-move', 'create-modified-move'];
    if (!subcommand || !moveCreationSubcommands.includes(subcommand.name)) {
      console.error('No move creation subcommand found. Cannot create move.', subcommand?.name);
      return;
    }

    // Handle move creation below
    if (!subcommandOptions?.length || subcommandOptions.length < 1 ) {
      console.error('No move options found even though they are required. Cannot create move.');
      return;
    }

    const typeMap = {
      'create-roll-outcome-move': 'roll',
      'create-simple-move': 'simple',
      'create-modified-move': 'modification'
    };

    const type: 'roll' | 'simple' | 'modification' = typeMap[subcommand.name];
    const moveName = getParam('name', subcommandOptions);

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

    const plus = getParam('plus', subcommandOptions);
    const maybeMoveToModify = getParam('moveToModify', subcommandOptions);
    
    const description = getRequiredStringParam('description', subcommandOptions);
    const commandDescription = description.length > 100 ?
      `${description.substring(0, 97)}...` : 
      description;
    
    const moveToModify =
      type == 'modification' && maybeMoveToModify ?
        getParam('basic-move', subcommandOptions) :
        undefined;

    const saveToLibrary = getBooleanParam('copy-to-library', subcommandOptions);

    const move: ISpecialMove = {
      guildId,
      key,
      createdOn: new Date().getTime(),
      description,
      commandDescription,
      guildName: messenger.channel.guild?.name,
      modifiers: type == 'simple' ? undefined : [{
        plus: true,
        property: plus!,
        type: 'property'
      }],
      moveToModify,
      name: moveName,
      type,
      userDiscriminator: user.discriminator,
      userName: user.username,
      userId: user.id,
      hasLibraryCopy: saveToLibrary
    }

    const createdMove = await createSpecialMove(key, guildId, move);

    if (saveToLibrary) {
      const libraryMove = {
        ...move,
        guildId: PUBLIC_GUILD_ID,
        guildIdOfOrigin: messenger.channel.guild?.name
      };

      await createSpecialMove(key, PUBLIC_GUILD_ID, libraryMove);
    }

    // We don't support this yet and I don't know if we'll need to.
    const isLibraryMove = false;

    if (subcommand?.name === 'create-roll-outcome-move') {
      await createMoveModalWithOutcomes.execute(messenger, user.id, key, isLibraryMove, createdMove);
    } else {
      const [embed, components] = createInfoResponse(createdMove as ISpecialMove, user.id);
      messenger.respondV2({ embeds: [embed], components, }, true);
    }
    
    return;
  }
}
