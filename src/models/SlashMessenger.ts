import Discord from 'discord.js';
import { CommandMessenger } from './CommandMessenger';
import {
  confirmInteraction,
  followupInteraction,
  confirmInteractionEmbed,
  followupInteractionEmbed,
  confirmInteractionWithModal,
  confirmInteractionV2,
  followupInteractionV2
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

  respondWithModal(components: any) {
    return confirmInteractionWithModal(this.#interactionId, this.#interactionToken, components);
  }

  followup(msg: string, components?: any[]) {
    return followupInteraction(this.#interactionToken, msg, components);
  }

  respondWithEmbed(embed: any, components?: any[]) {
    const embeds = embed ? [embed] : undefined;
    return confirmInteractionEmbed(this.#interactionId, this.#interactionToken, embeds, components);
  }

  async respondWithEmbeds(embeds: any[], components?: any[]) {
    confirmInteractionEmbed(this.#interactionId, this.#interactionToken, embeds, components);
    return;
  }

  followupWithEmbed(embed: any, components: any) {
    return followupInteractionEmbed(this.#interactionId, this.#interactionToken, embed, components);
  }

  respondV2( data: { content?: string; embeds?: any[]; components?: any[] }, ephemeral?: boolean) {
    const maybeEphemeralData = ephemeral ? { ...data, flags: 1 << 6 } : data;
    return confirmInteractionV2(this.#interactionId, this.#interactionToken, maybeEphemeralData);
  }

  followupV2(data: { content?: string; embeds?: any[]; components?: any[] }, ephemeral?: boolean) {
    const maybeEphemeralData = ephemeral ? { ...data, flags: 1 << 6 } : data;
    return followupInteractionV2(this.#interactionToken, maybeEphemeralData);
  }

}
