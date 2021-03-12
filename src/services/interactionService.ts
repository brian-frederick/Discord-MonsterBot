import { postInteraction } from '../api/interactions'

export async function confirmInteraction(interactionId: string, interactionToken: string, msg: string) {
  return await postInteraction(interactionId, interactionToken, msg);
}
