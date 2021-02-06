import Discord from "discord.js";
const _ = require('lodash');
const ddb = require('../utils/dynamodb');
const { someHunter, isMoveAdvanced } = require('../utils/hunter');
const moves =  require('../utils/moves');
const dice = require('../utils/dice');
const movesHelper = require('../utils/movesHelper');

export default {
  validate(): string {
    return;
  },

  async execute(
    channel: Discord.TextChannel,
    hunterId: string,
    moveKey: string,
    forward?: number
  ): Promise<void> {
    
    let hunter = await ddb.getHunter(hunterId);
    if (_.isEmpty(hunter)) {
      channel.send('Could not find your hunter. Rolling with some hunter.')
      hunter = someHunter;
    }

    const moveContext = moves[moveKey];

    const modifiers = [];

    moveContext.modifiers.forEach(mod => {
      modifiers.push({ key: mod.property, value: hunter[mod.property] })
    });

    if (forward) {
      modifiers.push({key: 'forward', value: forward });
    }

    const isAdvanced = isMoveAdvanced(moveKey, hunter.advancedMoves);

    const outcome = dice.roll(modifiers);    
    const outcomeEmbed = movesHelper.createOutcomeEmbed(hunter.firstName, outcome.total, outcome.equation, moveContext, isAdvanced);

    channel.send({ embed: outcomeEmbed });

    return;
  }
}
