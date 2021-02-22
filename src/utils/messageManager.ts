import Discord from 'discord.js';

export const yesNoFilter: (msg: Discord.Message) => boolean = msg => {
  return (
    msg.content.toLowerCase().includes('yes') ||
    msg.content.toLowerCase().includes('no')
  );
};

export const numFilter: (any) => boolean = msg => {
  return !isNaN(msg.content);
};

export const requesterFilter = (requesterId, msg) => msg.author.id === requesterId;

export const hasYesMsg = (coll: Discord.Collection<string, Discord.Message>) => {
  return coll.size > 0 && 
    coll.first().content.toLowerCase().includes('yes');
};

export const hasNoMsg = (coll: Discord.Collection<string, Discord.Message>) => {
  return coll.size > 0 && 
    coll.first().content.toLowerCase().includes('no');
};
