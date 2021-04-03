import { tag } from '../content/commonParams';
import params from '../utils/params';
import infoAction from '../actions/info';
import { CommandMessenger } from '../models/CommandMessenger';

module.exports = {
  name: 'info',
  description: 'Provides info on all basic moves.',
  params: [{name: "Move (text) (required)", value: "Move name for which you would like info."}],
	async execute(messenger: CommandMessenger, message, args) {
    let maybeBasicMoveKey: string | undefined;
    let maybeSpecialMoveKey: string | undefined;

    maybeBasicMoveKey = params.parseBasicMoveKey(args);
    maybeSpecialMoveKey = params.parseSpecialMoveKey(args);

    await infoAction.execute(messenger, maybeBasicMoveKey, maybeSpecialMoveKey);
    return;
	}
}
