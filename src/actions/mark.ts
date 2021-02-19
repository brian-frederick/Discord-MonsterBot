import Discord from 'discord.js';
import ddb from '../utils/dynamodb';
const _ = require('lodash');
import hunterHelper from '../utils/hunter';
import { Vital } from '../interfaces/enums';

export default {
  validate(hunterId: string, vital: Vital, value: number): string {
    if (!vital) {
      return 'You must include a vital - experience, luck, or harm to add to.';
    }
    
    if (isNaN(value)) {
      return 'gggGGGRowwwwllll... you must include a number for us to add to the vital.';
    }

    if (!hunterId) {
      return 'Blrrgh I do not know which hunter to udpate.';
    }

    return;
  },

  async execute(
    channel: Discord.TextChannel,
    hunterId: string,
    vital: Vital,
    value: number,
  ): Promise<void> {

    // if no value provided, default to 1.
    const vitalValue = !isNaN(value) ? value : 1;

    const errMsg = this.validate(hunterId, vital, vitalValue);
    if (errMsg) {
      channel.send(errMsg);
      return;
    }

    const UpdateExpression = `set ${vital} = ${vital} + :val`;
    const ExpressionAttributeValues = {
      ":val": { "N": vitalValue.toString() }
    };
    
    const updatedHunter = await ddb.updateHunter(hunterId, UpdateExpression, ExpressionAttributeValues);
    if (!updatedHunter) {
      channel.send('Something has gone wrong! Help!');
      return;
    }

    channel.send(`Marked ${vital} plus ${vitalValue}.`);
    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    channel.send({ embed: statSheet });

    return;
  }
}
