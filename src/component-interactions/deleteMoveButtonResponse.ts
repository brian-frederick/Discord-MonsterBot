import Discord from 'discord.js';
const _ = require('lodash');
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { parseCustomIdParams } from '../utils/componentInteractionParams';
import specialMovesService from '../services/specialMovesService';
import { ButtonCustomIdNames } from '../interfaces/enums';


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

    const moveContext = await specialMovesService.getSpecialMoveV2(moveKey, messenger.channel.guild?.id);
    if (!moveContext || _.isEmpty(moveContext)) {
      console.error('The custom id has the wrong key affixed. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find a move by that name.');
      return;
    }

    const deletedMove = await specialMovesService.deleteMove(moveKey, messenger.channel.guild?.id);

    if (!deletedMove) {
      console.error('The custom id has the wrong key affixed. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find a move by that name. Perhaps it has already been deleted.');
      return;
    }

    messenger.respond(`${deletedMove.name} has been deleted.`);
    return;
  }

}