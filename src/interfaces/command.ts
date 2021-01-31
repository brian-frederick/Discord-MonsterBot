import Discord from 'discord.js'

export interface command {
  name: string;
  aliases?: string[],
  execute: (message: Discord.Message, args: string[], commandName?: string) => void;
}