import { postInteraction, followup } from '../api/interactions'

export async function confirmInteraction(interactionId: string, interactionToken: string, msg: string) {
  const data = {
    content: msg
  };

  return await postInteraction(interactionId, interactionToken, data);
}

export async function followupInteraction(interactionToken: string, msg: string, components?: any[]) {
  const data = {
    content: msg,
    components
  };

  return await followup(interactionToken, data);
}

export async function confirmInteractionEmbed(interactionId: string, interactionToken: string, embeds: any[], components?: any[]) {
  const data = {
    embeds,
    components
  };

  return await postInteraction(interactionId, interactionToken, data);
}

export async function followupInteractionEmbed(interactionId: string, interactionToken: string, embed: any) {
  const data = {
    embeds: [embed]
  };

  return await followup(interactionToken, data);
}
