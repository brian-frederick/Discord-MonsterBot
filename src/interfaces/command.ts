import Discord from 'discord.js'

export interface Command {
  name: string;
  aliases?: string[],
  execute: (message: Discord.Message, args: string[], commandName?: string) => void;
}