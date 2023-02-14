const _ = require('lodash');
import * as hunterHelper from '../utils/hunter';
import { Vital } from '../interfaces/enums';
import { getActiveHunter, updateHunterProperty } from '../services/hunterServiceV2';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';
import { createActionRow, createButton, createSelect } from '../utils/components';

export default {
  async execute(
    messenger: DiscordMessenger,
  ): Promise<void> {

    const moveOptions = [
      { label: 'Act Under Pressure', value: 'aup' },
      { label: 'Help Out', value: 'ho' },
      { label: 'Investigate A Mystery', value: 'iam' },
      { label: 'Kick Some Ass', value: 'ksa' },
      { label: 'Manipulate Someone', value: 'ms' },
      { label: 'Protect Someone', value: 'ps' },
      { label: 'Read A Bad Situation', value: 'rabs' },
      { label: 'Use Magic', value: 'um' },
    ];

    const markXpButton = createSelect('move', moveOptions);

    const components = [createActionRow([markXpButton])];

    messenger.respondWithEmbed(null, components);

    return;
  }
}
