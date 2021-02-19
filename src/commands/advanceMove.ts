import { tag } from '../content/commonParams';
import params from '../utils/params';
import advanceMoveAction from '../actions/advanceMove';

module.exports = {
  name: 'advancemove',
  aliases: ['advance', 'adv'],
  description: 'Allows for advanced outcome of a move.',
  params: [
    { 
      name: '- Key (text) (required)', 
      value: "The key of the move to advance as part of a hunter improvement. Such as `ksa`, `aup`, `ho`, `iam`, `ms`, `ps`, `rabs`, `um` or the key for a special move."
    },
    { 
      name: '- Remove (text)', 
      value: "With the text `remove`, `minus`, or `-`, the inputted key will be removed if present."
    },
    tag
  ],
	async execute(message, args) {
    let hunterId: string | undefined;
    let maybeBasicMoveKey: string;
    let isRemove: boolean;
    let maybeSpecialMoveKey: string | undefined;

    hunterId = params.chooseHunterId(message.author.id, args);
    maybeBasicMoveKey = params.parseBasicMoveKey(args);
    maybeSpecialMoveKey = maybeBasicMoveKey ? undefined : params.parseSpecialMoveKey(args);
    isRemove = params.isRemove(args);

    // clean up data before passing to action
    maybeBasicMoveKey = maybeBasicMoveKey ? maybeBasicMoveKey.toLowerCase() : undefined;
    maybeSpecialMoveKey = maybeSpecialMoveKey ? maybeSpecialMoveKey.toLowerCase() : undefined;

    await advanceMoveAction.execute(message.channel, hunterId, maybeBasicMoveKey, maybeSpecialMoveKey, isRemove);
    return;
	}
};