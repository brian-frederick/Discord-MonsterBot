import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import Discord from 'discord.js';
import { parseCustomIdParams } from "../utils/componentInteractionParams";
import { createInfoResponse, PUBLIC_GUILD_ID } from "../utils/specialMovesHelper";
import specialMovesService, { createSpecialMove } from '../services/specialMovesService';
import { ButtonCustomIdNames } from "../interfaces/enums";
import { hexColors } from "../content/theme";
import { ISpecialMove } from "../interfaces/ISpecialMove";
import { update } from "../db/moves";
const _ = require('lodash');
const movesHelper = require('../utils/movesHelper');


export default {
  name: `${ButtonCustomIdNames.copy_move_to_library}`,
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User) {
    const params = parseCustomIdParams(customId);
    const moveKey = params[0];
    if (!moveKey) {
      console.error('The custom id does not have a key. This is unexpected.');
      messenger.respondV2({content: 'BLORP whimper whimper. Could not find this move!'} , true);
      return;
    }

    const originalMoveGuildId = messenger.channel.guild.id;

    const originalMove = await specialMovesService.getSpecialMoveV2(moveKey, originalMoveGuildId);
    if (!originalMove || _.isEmpty(originalMove)) {
      console.error(`Failed to get move ${moveKey} for guild ${originalMoveGuildId}. This is unexpected.`);
      messenger.respondV2({content: 'BLORP whimper whimper. Could not find a move by that name.' }, true);
      return;
    }
      
    let updatedMove = {
      ...originalMove,
      createdOn: new Date().getTime(),
      guildId: PUBLIC_GUILD_ID,
      guildName: 'Library',
      userId: user.id,
      userName: user.username,
      userDiscriminator: user.discriminator,
      guildIdOfOrigin: originalMoveGuildId,
    }

    const addedMove = await createSpecialMove(moveKey, PUBLIC_GUILD_ID, updatedMove);
    if (!addedMove) {
      console.error('Could not add move to database');
      messenger.respondV2({ content:'BLORP whimper whimper. Could not add move to database. Possibly because it already exists.'} , true);
      return;
    }

    await update(originalMoveGuildId, moveKey, { hasLibraryCopy: true });
    
    const updateSuccessEmbed = {
      color: hexColors.green,
      description: `${addedMove.name} has been updated.`
    };
    
    const [embed, components] = createInfoResponse(addedMove as ISpecialMove, user.id);
    messenger.respondV2({ embeds: [updateSuccessEmbed, embed], components }, true);
    return;
  }
}