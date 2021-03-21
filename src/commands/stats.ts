import { tag } from '../content/commonParams';
import statsAction from '../actions/stats';
import params from '../utils/params';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'stats',
  description: 'Provides hunter stats.',
  params: [tag],
	async execute(messenger: CommandMessenger, message, args) {
    let hunterId: string;

    hunterId = params.chooseHunterId(message.author.id, args);
    
    await statsAction.execute(messenger, hunterId);

    return;
	}
};
