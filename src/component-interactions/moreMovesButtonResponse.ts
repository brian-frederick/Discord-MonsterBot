import Discord from 'discord.js';
const _ = require('lodash');
import { DiscordMessenger } from "../interfaces/DiscordMessenger";
import { hasLibraryIndicatorParam } from '../utils/componentInteractionParams';
import { getAllSpecialMoves } from '../services/specialMovesService';
import { ButtonCustomIdNames } from '../interfaces/enums';
import { createBulkMovesResponse, PUBLIC_GUILD_ID } from '../utils/specialMovesHelper';
import { ISpecialMove } from '../interfaces/ISpecialMove';

export default {
  name: `${ButtonCustomIdNames.more_moves}`,
  async execute(customId: string, messenger: DiscordMessenger, user: Discord.User) {

    const isLibraryMove = hasLibraryIndicatorParam(customId);
    const guildId = isLibraryMove ?
      PUBLIC_GUILD_ID :
      messenger.channel.guild.id;
      
    const [moves, maybeLastEvaluatedKey] = await getAllSpecialMoves({ 
      guildId,
      searchTerm: undefined,
      customId
    });
    
    if (!moves || moves.length === 0) {
      console.error('The search has not returned any more moves. This is unexpected.');
      messenger.respond('BLORP whimper whimper. Could not find any moves.');
      return;
    }

    const [embed, components] = createBulkMovesResponse({
      moves: moves as ISpecialMove[],
      maybeSearchKey: undefined,
      maybeLastEvaluatedKey
    });

    await messenger.respondV2({ embeds: [embed], components }, true);

    return;
  }

}