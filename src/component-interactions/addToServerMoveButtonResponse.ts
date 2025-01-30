import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import Discord from 'discord.js';
import { parseCustomIdParams } from "../utils/componentInteractionParams";
import { createInfoResponse, PUBLIC_GUILD_ID } from "../utils/specialMovesHelper";
import specialMovesService, { createSpecialMove } from '../services/specialMovesService';
import { ButtonCustomIdNames } from "../interfaces/enums";
import { hexColors } from "../content/theme";
import { ISpecialMove } from "../interfaces/ISpecialMove";
const _ = require('lodash');


export default {
  name: `${ButtonCustomIdNames.add_move_to_server}`,
  async execute(customId: string, messenger: DiscordMessenger,  user: Discord.User) {
    const params = parseCustomIdParams(customId);
    const moveKey = params[0];
    if (!moveKey) {
      console.error('The custom id does not have a key. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find this move!');
      return;
    }

    const libraryMove = await specialMovesService.getSpecialMoveV2(moveKey, PUBLIC_GUILD_ID);
    if (!libraryMove || _.isEmpty(libraryMove)) {
      console.error(`Failed to get move ${moveKey} for library. This is unexpected.`);
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }
    
    let updatedMove = {
      ...libraryMove,
      createdOn: new Date().getTime(),
      guildId: messenger.channel.guild.id,
      guildName: messenger.channel.guild.name,
      userId: user.id,
      userName: user.username,
      userDiscriminator: user.discriminator,
      hasLibraryCopy: true
    }

    const addedMove = await createSpecialMove(moveKey, messenger.channel.guild.id, updatedMove);
    if (!addedMove) {
      console.error('Could not add move to database');
      messenger.respond('BLORP whimper whimper. Could not add move to database.');
      return;
    }

    const updateSuccessEmbed = {
      color: hexColors.green,
      description: `${addedMove.name} has been updated.`
    };
    
    const [embed, components] = createInfoResponse(addedMove as ISpecialMove, user.id);
    messenger.respondWithEmbeds([updateSuccessEmbed,embed], components);
    return;
  }
}