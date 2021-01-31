import Discord from 'discord.js';
import { option } from '../interfaces/discordInteractions';
import { getParam } from '../utils/interactionParams';

export default {
  name: 'inventory',
  async execute(channel: Discord.TextChannel, user: Discord.User, guildId, options: option[] = []) {
    let item;
    let transaction;
    let hunter;
    
    
    console.log('user', user);
    console.log('options', options);

    if (options.length > 0) {
      item = getParam('item', options);
      transaction = getParam('transaction', options);
      hunter = getParam('hunter', options);
    }

    if (item && !transaction) {
      channel.send('Blrrgh. If you enter an item you must tell me whether to add or remove it!');
      return;
    }
    
    if (transaction && !item) {
      channel.send(`Blrrgh. I don't know what item to ${transaction}.`);
      return;
    }


    console.log(`item: ${item}, transaction: ${transaction}, hunter: ${hunter} `);
    channel.send('Oh I am going to do something with this for sure. wink!');

    return null;
  }
}
