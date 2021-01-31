const moves =  require('../../utils/moves');
const { infoOutcomeFields, infoDescription } = require('../../utils/movesHelper');
const specialMovesService = require('../../services/specialMovesService');
const params = require('../../utils/params');

module.exports = {
  name: 'info',
  description: 'Provides info on all basic moves.',
  params: [{name: "Move (text) (required)", value: "Move name for which you would like info."}],
	async execute(message, args) {
    let moveContext;
    let requestedMove;

    requestedMove = params.parseBasicMoveKey(args);
    console.log('requestedMove: ', requestedMove)

    if (requestedMove) {
      moveContext = moves[requestedMove.key];
    } else {
      const specialMoveKey = params.parseSpecialMoveKey(args);

      if (!specialMoveKey) {
        message.channel.send(`Blrgh! You must include the key of a move!`);
        return;
      }
      console.log('message: ', message);
      moveContext = await specialMovesService.getSpecialMove(specialMoveKey, message.guild?.id);
    }

    if (!moveContext) {
      message.channel.send(`Blrgh! Cannot find a move to give you info about!`);
      return;
    }

    let moveEmbed = {
      title: moveContext.name,
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

    message.channel.send({ embed: moveEmbed });
	}
}
