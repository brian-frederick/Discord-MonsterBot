import { tag } from '../content/commonParams';
import params from '../utils/params';
import updateAction from '../actions/update';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'update',
  description: 'Updates hunter stats like cool, charm, tough, sharp, weird.',
  params: [
    { name: `- Property ('cool', 'charm', 'experience', 'harm', 'luck', 'tough', 'sharp', or 'weird') (required)`,
    value: 'The hunter property to be updated.'}, 
    tag,
    {
      name: '- Modifier (number) (required)',
      value: 'A positive or negative number which will replace the existing value of the given property.'
    }
  ],
	async execute(messenger: CommandMessenger, message, args) {
    let hunterId;
    let statName;
    let value;

    hunterId = params.chooseHunterId(message.author.id, args);
    value = params.parseAllForNumber(args);
    statName = params.parseUpdateStat(args);
    
    await updateAction.execute(messenger, hunterId, statName, value)
    return;
	}
};
