import Discord from 'discord.js';
import { CommandMessenger } from './CommandMessenger';
import {
  confirmInteraction,
  followupInteraction,
  confirmInteractionEmbed,
  followupInteractionEmbed
} from '../services/interactionService'; 

export class SlashCommandMessenger extends CommandMessenger {
  #interactionId: string;
  #interactionToken: string;
  constructor(channel: Discord.TextChannel, interactionToken: string, interactionId: string) {
    super(channel);
    this.#interactionToken = interactionToken;
    this.#interactionId = interactionId;
  }

  respond(msg: string) {
    return confirmInteraction(this.#interactionId, this.#interactionToken, msg);
  }

  followup(msg: string, components?: any[]) {
    return followupInteraction(this.#interactionToken, msg, components);
  }

  respondWithEmbed(embed: any, components?: any[]) {
    const embeds = embed ? [embed] : null;
    return confirmInteractionEmbed(this.#interactionId, this.#interactionToken, embeds, components);
  }

  async respondWithEmbeds(embeds: any[], components?: any[]) {
    confirmInteractionEmbed(this.#interactionId, this.#interactionToken, embeds, components);
    return;
  }

  followupWithEmbed(embed: any) {
    return followupInteractionEmbed(this.#interactionId, this.#interactionToken, embed);
  }
}
