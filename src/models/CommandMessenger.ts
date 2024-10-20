import Discord from 'discord.js';
import { DiscordMessenger } from '../interfaces/DiscordMessenger'

export class CommandMessenger implements DiscordMessenger {
  channel: Discord.TextChannel;
  constructor(channel: Discord.TextChannel) {
    this.channel = channel;
  }
  
  respond(msg: string) {
    return this.channel.send(msg);
  }

  followup(msg: string) {
    return this.respond(msg);
  }

  respondWithEmbed(embed: any) {
    return this.channel.send({ embeds:embed });
  }

  async respondWithEmbeds(embeds: any[]) {
    await embeds.forEach(e => this.channel.send({ embeds: e }));
    return;
  }

  followupWithEmbed(embed: any) {
    return this.respondWithEmbed(embed);
  }
}
