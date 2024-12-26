import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import Discord from 'discord.js';
import { hasLibraryIndicatorParam, parseCustomIdParams } from "../utils/componentInteractionParams";
import { CUSTOM_ID_LIBRARY_IND, PUBLIC_GUILD_ID } from "../utils/specialMovesHelper";
import specialMovesService, { createSpecialMove } from '../services/specialMovesService';
import { ButtonCustomIdNames } from "../interfaces/enums";
import { hexColors } from "../content/theme";
import { createActionRow, createButton } from "../utils/components";
const _ = require('lodash');
const movesHelper = require('../utils/movesHelper');


export default {
  name: `${ButtonCustomIdNames.add_move}`,
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User) {
    const params = parseCustomIdParams(customId);
    const moveKey = params[0];
    if (!moveKey) {
      console.error('The custom id does not have a key. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find this move!');
      return;
    }

    const originalMoveIsFromLibrary = hasLibraryIndicatorParam(customId);
    const originalMoveGuildId = originalMoveIsFromLibrary ?
      PUBLIC_GUILD_ID :
      messenger.channel.guild.id;

    const originalMove = await specialMovesService.getSpecialMoveV2(moveKey, originalMoveGuildId);
    if (!originalMove || _.isEmpty(originalMove)) {
      console.error(`Failed to get move ${moveKey} for guild ${originalMoveGuildId}. This is unexpected.`);
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }
  
    // If the move is in the library, add it to the user's guild. And vice versa.
    const destinationGuildId = originalMoveIsFromLibrary ?  messenger.channel.guild.id : PUBLIC_GUILD_ID;
    const destinationGuildName = originalMoveIsFromLibrary ? messenger.channel.guild.name : 'Library';
    let updatedMove = {
      ...originalMove,
      createdOn: new Date().getTime(),
      guildId: destinationGuildId,
      guildName: destinationGuildName,
      userId: user.id,
      userName: user.username,
      userDiscriminator: user.discriminator,
    }

    const addedMove = await createSpecialMove(moveKey, destinationGuildId, updatedMove);
    if (!addedMove) {
      console.error('Could not add move to database');
      messenger.respond('BLORP whimper whimper. Could not add move to database.');
      return;
    }

    const updateSuccessEmbed = {
      color: hexColors.green,
      description: `${addedMove.name} has been updated.`
    };

    const infoEmbed = movesHelper.createInfoEmbed(addedMove);

    const editButtonCustomId = addedMove.guildId === PUBLIC_GUILD_ID ?
      `${ButtonCustomIdNames.edit_move}_${moveKey}_${CUSTOM_ID_LIBRARY_IND}` :
      `${ButtonCustomIdNames.edit_move}_${moveKey}`;

    const editButton = createButton("Edit", 1, editButtonCustomId);
    const components = [createActionRow([editButton])];

    messenger.respondWithEmbeds([updateSuccessEmbed, infoEmbed], components);
    return;
  }
}