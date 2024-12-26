import Discord from 'discord.js';
const _ = require('lodash');
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { hasLibraryIndicatorParam, parseCustomIdParams } from '../utils/componentInteractionParams';
import specialMovesService from '../services/specialMovesService';
import { ButtonCustomIdNames } from '../interfaces/enums';
import { hasPermissionToEdit, PUBLIC_GUILD_ID } from '../utils/specialMovesHelper';
import { ISpecialMove } from '../interfaces/ISpecialMove';


export default {
  name: `${ButtonCustomIdNames.delete_move}`,
  async execute(customId: string, messenger: DiscordMessenger, user: Discord.User, data: any) {
    const params = parseCustomIdParams(customId);
    const moveKey = params[0];
    if (!moveKey) {
      console.error('The custom id does not have a key. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find this move!');
      return;
    }

    const isLibraryMove = hasLibraryIndicatorParam(customId);
    const guildId = isLibraryMove ?
      PUBLIC_GUILD_ID :
      messenger.channel.guild.id;

    const moveContext = await specialMovesService.getSpecialMoveV2(moveKey, guildId);
    if (!moveContext || _.isEmpty(moveContext)) {
      console.error('The custom id has the wrong key affixed. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    const hasPermission = hasPermissionToEdit(moveContext as ISpecialMove, user.id);
    if (!hasPermission) {
      console.error(`${user.username} attempting to delete move ${moveContext.name} without the proper permissions.`);
      messenger.respond('BLORP whimper whimper. It looks like you do not have permission to delete this move.');
      return;
    }

    const deletedMove = await specialMovesService.deleteMove(moveKey, guildId);
    if (!deletedMove) {
      console.error('The custom id has the wrong key affixed. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find a move by that name. Perhaps it has already been deleted.');
      return;
    }

    messenger.respond(`${deletedMove.name} has been deleted.`);
    return;
  }

}