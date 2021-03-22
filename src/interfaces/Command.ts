import Discord from 'discord.js'
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export interface Command {
  name: string;
  aliases?: string[],
  execute: (
    messenger: DiscordMessenger,
    message: Discord.Message,
    args: string[],
    commandName?: string
  ) => void;
}
