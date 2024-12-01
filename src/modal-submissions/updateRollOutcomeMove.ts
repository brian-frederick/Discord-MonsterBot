import Discord from 'discord.js';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { CustomMoveModalInputFields, ModalCustomIdNames } from '../interfaces/enums';
import { parseCustomIdParams } from '../utils/componentInteractionParams';
import { update } from '../db/moves';
const movesHelper = require('../utils/movesHelper');

export default {
  name: ModalCustomIdNames.update_roll_outcome_move,
  async execute(data, messenger: DiscordMessenger, user: Discord.User) {
    const userId = user.id;
    const guildId = messenger.channel.guildId;

    const customMoveId = parseCustomIdParams(data.custom_id)[0];
    console.log('bftest customMoveId', customMoveId);
    console.log('data', JSON.stringify(data, null, 2));

    const fields = data.components.flatMap(c => c.components[0]);
    console.log('bftest fields', JSON.stringify(fields, null, 2));

    const description = fields.find(f => f.custom_id === CustomMoveModalInputFields.description)?.value;
    const lowOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.low_outcome)?.value;
    const middleOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.middle_outcome)?.value;
    const highOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.high_outcome)?.value;
    const advancedOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.advanced_outcome)?.value;

    const moveToUpdate = {
      description,
      outcome: {
        advanced: {
          description: advancedOutcome,
          title: "On a 12+..."
        },
        fail: {
          description: lowOutcome,
          title: "On a fail..."
        },
        high: {
          description: highOutcome,
          title: "On a 10+..."
        },
        success: {
          description: middleOutcome,
          title: "On a 7+..."
        }
      },
    }

    console.log('bftest updatedMove', JSON.stringify(moveToUpdate, null, 2));

    const updated = await update(guildId, customMoveId, moveToUpdate.description, moveToUpdate.outcome);
    if (!updated) {
      messenger.respond('Blarrr... something went wrong!');
      return;
    }

    const infoEmbed = movesHelper.createInfoEmbed(updated);
    messenger.respondWithEmbed(infoEmbed);
    return;
  }
}