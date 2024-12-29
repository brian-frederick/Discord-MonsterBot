import { postInteraction, followup, postInteractionModal } from '../api/interactions'

export async function confirmInteraction(interactionId: string, interactionToken: string, msg: string) {
  const data = {
    content: msg
  };

  return await postInteraction(interactionId, interactionToken, data);
}

export async function confirmInteractionWithModal(interactionId: string, interactionToken: string, data: any) {

  return await postInteractionModal(interactionId, interactionToken, data);
}

export async function followupInteraction(interactionToken: string, msg: string, components?: any[]) {
  const data = {
    content: msg,
    components
  };

  return await followup(interactionToken, data);
}

export async function confirmInteractionEmbed(interactionId: string, interactionToken: string, embeds?: any[], components?: any[]) {
  const data = {
    embeds,
    components
  };

  return await postInteraction(interactionId, interactionToken, data);
}

export async function followupInteractionEmbed(interactionId: string, interactionToken: string, embed: any, components: any) {
  const data = {
    embeds: [embed],
    components
  };

  return await followup(interactionToken, data);
}

export async function confirmInteractionV2(interactionId: string, interactionToken: string, data: { content?: string; embeds?: any[]; components?: any[], flags?: number}) {
  return await postInteraction(interactionId, interactionToken, data);
}

export async function followupInteractionV2(interactionToken: string, data: { content?: string; embeds?: any[]; components?: any[], flags?: number}) {
  return await followup(interactionToken, data);
}