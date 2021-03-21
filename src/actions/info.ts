import moves from '../utils/moves';
import specialMovesService from '../services/specialMovesService';
import { infoOutcomeFields, infoDescription } from '../utils/movesHelper';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(
    maybeBasicMoveKey: string | undefined,
    maybeSpecialMoveKey: string | undefined
  ): string {
    if (!maybeBasicMoveKey && !maybeSpecialMoveKey) {
      return 'Blrrgh. Cannot find a move to advance!';
    }

    if (maybeBasicMoveKey && maybeSpecialMoveKey) {
      return `GRRRR. Do not make me decide whether to update ${maybeBasicMoveKey} or ${maybeSpecialMoveKey}! I am just a dumb monsterbot!`;
    }

    return;
  },

  async execute(
    messenger: DiscordMessenger,
    maybeBasicMoveKey:string | undefined,
    maybeSpecialMoveKey: string | undefined,
  ): Promise<void> {
    let moveContext;
    let requestedMove;

    console.log('We are in the action now!');
    console.log(`Action params - maybeBasicMoveKey: ${maybeBasicMoveKey}, maybeSpecialMoveKey: ${maybeSpecialMoveKey}.`);

    const errorMessage = this.validate(maybeBasicMoveKey, maybeSpecialMoveKey);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }
    
    if (maybeBasicMoveKey) {
      moveContext = moves[maybeBasicMoveKey];
    }

    if (maybeSpecialMoveKey) {
      moveContext = await specialMovesService.getSpecialMove(maybeSpecialMoveKey, messenger.channel?.guild?.id);
    }

    if (!moveContext) {
      messenger.channel.send(`Blrgh! Cannot find a move to give you info about!`);
      return;
    }

    let moveEmbed = {
      title: moveContext.name,
      description: '',
      fields: [],
      url: ''
    };

    const secondaryContext = (moveContext.type === 'modification') ?
      moves[moveContext.moveToModify] :
      null;

    moveEmbed.description = infoDescription(moveContext, secondaryContext)

    moveEmbed.fields = (moveContext.type === 'roll') ?
      infoOutcomeFields(moveContext.outcome) :
      null;

    if (moveContext.guildId) {
      moveEmbed.url = `https://www.monsterbot.io/moves/show/${moveContext.key}/guild/${moveContext.guildId}`;
    }

    messenger.respondWithEmbed(moveEmbed);
    return;
  }
}
