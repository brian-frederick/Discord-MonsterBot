import Discord from 'discord.js';
import ddb from '../utils/dynamodb';
import { Stat } from '../interfaces/enums';
import * as hunterHelper from '../utils/hunter';
import { updateHunterProperty } from '../services/hunterService';

export default {
  validate(hunterId: string, stat: Stat, value: number): string {
    if (!stat) {
      return 'You must include a stat like cool, charm, tough, sharp, or weird to update.';
    }
    
    if (isNaN(value)) {
      return 'gggGGGRowwwwllll... you must include a number for us to update the stat.';
    }

    if (!hunterId) {
      return 'Blrrgh I do not know which hunter to udpate.';
    }

    return;
  },

  async execute(
    channel: Discord.TextChannel,
    hunterId: string,
    stat: Stat,
    value: number
  ): Promise<void> {

    console.log(`action params hunterId: ${hunterId} stat: ${stat} value: ${value}`);

    const errMsg = this.validate(hunterId, stat, value);
    if (errMsg) {
      channel.send(errMsg);
      return;
    }
    
    const updatedHunter = await updateHunterProperty(hunterId, stat, value);
    if (!updatedHunter) {
      channel.send('Something has gone wrong! Help!');
      return;
    }

    channel.send(`updated ${stat} to ${value}.`);

    const statSheet = hunterHelper.statsEmbed(updatedHunter);
    channel.send({ embed: statSheet });
    
    return;
  }
}
