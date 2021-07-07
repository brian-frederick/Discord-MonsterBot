import { CommandMessenger } from '../models/CommandMessenger';
import roll from '../actions/roll';
import { modifier } from '../content/commonParams';
import params from '../utils/params';

module.exports = {
	name: 'roll',
  description: 'Just rolls two d6.',
  params: [modifier],
	execute(messenger: CommandMessenger, message, args) {
    let hunterProperty;
    let fwd;
    let hunterId;
    
    fwd = params.parseAllForNumber(args);
    hunterProperty = params.parseAllForHunterStat(args);    
    hunterId = params.chooseHunterId(message.author.id, args);
    
    roll.execute(messenger, hunterId, message.author.username, fwd, hunterProperty);

	}
};
