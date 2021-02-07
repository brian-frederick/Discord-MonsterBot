const { tag, modifier } = require('../content/commonParams');
const ddb = require('../utils/dynamodb');
const params = require('../utils/params');
const hunterHelper = require('../utils/hunter');
import markAction from '../actions/mark';

module.exports = {
  name: 'mark',
  description: 'Adds to experience, harm, or luck. If no number is given, defaults to adding 1.',
  params: [
    modifier,
    tag,  
    { name: `- Vital ('experience', 'harm', or 'luck') (required)`, value: 'A hunter vital to increment by the corresponding modifier.'}
  ],
	async execute(message, args) {
    let vital;
    let value;
    let hunterId;

    hunterId = params.chooseHunterId(message.author.id, args);
    vital = params.parseAllForVital(args);
    value = params.parseAllForNumber(args);

    console.log('vital', vital);
    await markAction.execute(message.channel, hunterId, vital, value);

    return;
	}
};
