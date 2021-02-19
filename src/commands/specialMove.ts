const params = require('../utils/params');
const { tag, modifier } = require('../content/commonParams');
import specialMoveAction from '../actions/specialMove';

module.exports = {
  name: 'specialmove',
  aliases: ['secretmenu', 'sm', '!'],
  description: 'Invokes special moves.',
  params: [modifier, tag],
	async execute(message, args) {
    let hunterId;
    let key;
    let forward;

    hunterId = params.chooseHunterId(message.author.id, args);
    forward = params.parseAllForNumber(args);
    key = params.parseSpecialMoveKey(args);

    await specialMoveAction.execute(message.channel, hunterId, key, forward);
	}
};
