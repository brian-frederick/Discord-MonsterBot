import Discord from 'discord.js';
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { CustomMoveModalInputFields, ModalCustomIdNames } from '../interfaces/enums';
import { hasLibraryIndicatorParam, parseCustomIdParams } from '../utils/componentInteractionParams';
import { update } from '../db/moves';
import { hexColors } from '../content/theme';
import { createInfoResponse, CUSTOM_ID_LIBRARY_IND, PUBLIC_GUILD_ID } from '../utils/specialMovesHelper';
import { ISpecialMove } from '../interfaces/ISpecialMove';
const movesHelper = require('../utils/movesHelper');

export default {
  name: ModalCustomIdNames.update_move,
  async execute(data, messenger: DiscordMessenger, user: Discord.User) {
    const isLibraryMove = hasLibraryIndicatorParam(data.custom_id);
    const guildId = isLibraryMove ?
      PUBLIC_GUILD_ID :
      messenger.channel.guildId;

    const customMoveId = parseCustomIdParams(data.custom_id)[0];

    const fields = data.components.flatMap(c => c.components[0]);

    const description = fields.find(f => f.custom_id === CustomMoveModalInputFields.description)?.value;
    const lowOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.low_outcome)?.value;
    const middleOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.middle_outcome)?.value;
    const highOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.high_outcome)?.value;
    const advancedOutcome = fields.find(f => f.custom_id === CustomMoveModalInputFields.advanced_outcome)?.value;

    const hasOutcomes = !![lowOutcome, middleOutcome, highOutcome, advancedOutcome].find(o => o !== null && o !== undefined);
    const outcome = !hasOutcomes ? undefined : {
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
      };

    const updated = await update(guildId, customMoveId, { description, outcome });
    if (!updated) {
      messenger.respond('Blarrr... something went wrong!');
      return;
    }

    // keep library copy and original move in sync
    if (!isLibraryMove && updated.hasLibraryCopy) {
      await update(PUBLIC_GUILD_ID, customMoveId, { description, outcome });
    } else if (isLibraryMove && updated.guildIdOfOrigin === messenger.channel.guild.id) {
      await update(messenger.channel.guild.id, customMoveId,{ description, outcome });
    }

    const updateSuccessEmbed = {
      color: hexColors.green,
      description: `${updated.name} has been updated.`
    };

    const [embed, components] = createInfoResponse(updated as ISpecialMove, user.id);
    messenger.respondV2({ embeds: [updateSuccessEmbed, embed], components}, true );
    return;
  }
}