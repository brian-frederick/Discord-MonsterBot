import { chooseHunterId, parseAllForNumber } from '../utils/params';
import { tag, modifier } from '../content/commonParams';
import moveAction from '../actions/move';

module.exports = {
  name: 'move',
  aliases: ['ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', 'um'],
  description: `Execute all basic moves. In this unique case, the command 'move' should not be used at all. Just the move key or alias.
    These include 'ksa', 'aup', 'ho', 'iam', 'ms', 'ps', 'rabs', or 'um'.`,
  params: [
    modifier,
    tag,
  ],
	async execute(message, args, alias) {
    let moveKey;
    let forward;
    let hunterId: string;

    if (!alias) {
      message.channel.send('Specify a move such as ksa (Kick Some Ass), aup (Act Under Pressure), ho (help out), iam (Investigate A Mystery), ms (Manipulate Someone), ps (Protect Someone), rabs (Read A Bad Situation), um (Use Magic).');
      return;
    }

    moveKey = alias;
    hunterId = chooseHunterId(message.author.id, args);

    const maybeForward = parseAllForNumber(args);
    forward = maybeForward ? maybeForward.toString() : null;

    await moveAction.execute(message.channel, hunterId, forward);
    
    return;
	}
};
