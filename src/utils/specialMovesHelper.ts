import { ButtonCustomIdNames } from "../interfaces/enums";
import { ISpecialMove } from "../interfaces/ISpecialMove";
import { createActionRow, createButton } from "./components";
const { createInfoEmbed } = require('../utils/movesHelper');
const { rollOutcomeEmbed } = require('../utils/movesHelper');
const { hexColors } = require('../content/theme');

/**
 * Custom moves that are publicly available
 * to be copied over to a server
 * are called library moves.
 * They are stored with GuildId 1.
 */
export const PUBLIC_GUILD_ID = "1";
export const CUSTOM_ID_LIBRARY_IND = "L";

export function createSimpleEmbed(name, move) {
  return {
    title: `${name} just used ${move.name}.`,
    description: move.description
  };
}

export function createModificationMessages(name, total, equation, moveContext, secondaryContext, isAdvanced) {
  
  if (total >= 12 && isAdvanced && secondaryContext.outcome?.advanced?.description) {
      const actionReport = `Wow! ${name} just crushed ${moveContext.name} with a roll of ${total}! ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.advanced, title: `On a 12+ Advanced ${moveContext.name}....` };

      return rollOutcomeEmbed(
        hexColors.purple,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else if (total >= 10) {
      const actionReport =  `Hey! ${name} just rolled a solid ${total} on ${moveContext.name}! ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.high, title: `On a 10+ ${moveContext.name}....` };
      
      return rollOutcomeEmbed(
        hexColors.green,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else if (total >= 7) {
      const actionReport = `${name} just rolled a ${total} on ${moveContext.name}. ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.success, title: `On a 7-9 ${moveContext.name}....` };
      
      return rollOutcomeEmbed(
        hexColors.yellow,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome
      );
  } else {
      const actionReport = `Yikes. ${name} just missed on ${moveContext.name} with a roll of ${total}. ${moveContext.name} modifies ${secondaryContext.name}.`;
      const outcome = { ...secondaryContext.outcome.fail, title: `On a failed ${moveContext.name}....`};
      const failGif = moveContext.failGif ? moveContext.failGif : null;
    
      return rollOutcomeEmbed(
        hexColors.red,
        actionReport,
        equation,
        moveContext.name,
        moveContext.description,
        outcome,
        failGif
      );
  }
}

// A guild specific move takes priority over a public move with the same key.
export function takePriority(moves, guildId) {

  if (!guildId) {
    return moves[0];
  }
  
  const guildIdStr = guildId.toString();

  let move = moves.find(m => m.guildId === guildIdStr);
  if (!move) {
    move = moves.find(m => m.guildId === PUBLIC_GUILD_ID);
  }
  return move;
}

export function createInfoResponse(moveContext: ISpecialMove, userId: string): [any, any] {
  const key = moveContext.key;
  const embed = createInfoEmbed(moveContext);
  const isOwner = moveContext.userId === userId;

  const libraryAddToServerButton = createButton("Add to Server", 3, `${ButtonCustomIdNames.add_move}_${key}_${CUSTOM_ID_LIBRARY_IND}`);
  const libraryEditButton = createButton("Edit", 1, `${ButtonCustomIdNames.edit_move}_${key}_${CUSTOM_ID_LIBRARY_IND}`)
  const libraryDeleteButton = createButton("Delete from Library", 4, `${ButtonCustomIdNames.delete_move}_${key}_${CUSTOM_ID_LIBRARY_IND}`);
  const editButton = createButton("Edit", 1, `${ButtonCustomIdNames.edit_move}_${key}`)
  const deleteButton = createButton("Delete", 4, `${ButtonCustomIdNames.delete_move}_${key}`);

  const guildSpecificButtons = [editButton, deleteButton];
  const libraryButtons = isOwner ?
    [libraryAddToServerButton, libraryEditButton, libraryDeleteButton] :
    [libraryAddToServerButton];
 
  const components = moveContext.guildId === PUBLIC_GUILD_ID ?
    [createActionRow(libraryButtons)] :
    [createActionRow(guildSpecificButtons)];
  
  return [embed, components];
}

export function hasPermissionToEdit(moveContext: ISpecialMove, userId: string) {
  return moveContext.userId === userId || moveContext.guildId !== PUBLIC_GUILD_ID;
}
