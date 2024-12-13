import Discord from 'discord.js';
const _ = require('lodash');
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { parseCustomIdParams } from '../utils/componentInteractionParams';
import specialMovesService from '../services/specialMovesService';
import createMoveModalWithOutcomes from '../actions/customMoves/create-move-modal-with-outcomes';
import createMoveModal from '../actions/customMoves/create-move-modal';
import { ButtonCustomIdNames } from '../interfaces/enums';


export default {
  name: `${ButtonCustomIdNames.edit_move}`, // this is edit move. saving space since this is fired by an id.
  async execute(customId: string, messenger: DiscordMessenger, user: Discord.User) {
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

    if (moveContext.type === 'roll') {
      await createMoveModalWithOutcomes.execute(messenger, user.id, moveKey, moveContext);
    } else {
      await createMoveModal.execute(messenger, user.id, moveKey, moveContext);
    }

    return;
  }

}