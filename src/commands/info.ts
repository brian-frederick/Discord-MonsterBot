import { tag } from '../content/commonParams';
import params from '../utils/params';
import infoAction from '../actions/info';

module.exports = {
  name: 'info',
  description: 'Provides info on all basic moves.',
  params: [{name: "Move (text) (required)", value: "Move name for which you would like info."}],
	async execute(message, args) {
    let maybeBasicMoveKey: string | undefined;
    let maybeSpecialMoveKey: string | undefined;

    maybeBasicMoveKey = params.parseBasicMoveKey(args);
    maybeSpecialMoveKey = params.parseSpecialMoveKey(args);

    await infoAction.execute(message.channel, maybeBasicMoveKey, maybeSpecialMoveKey);
    return;
	}
}
