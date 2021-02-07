import { tag } from '../content/commonParams';
import statsAction from '../actions/stats';
import params from '../utils/params';

module.exports = {
  name: 'stats',
  description: 'Provides hunter stats.',
  params: [tag],
	async execute(message, args) {
    let hunterId: string;

    hunterId = params.chooseHunterId(message.author.id, args);
    
    await statsAction.execute(message.channel, hunterId);

    return;
	}
};
