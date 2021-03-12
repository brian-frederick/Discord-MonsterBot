import { String } from 'aws-sdk/clients/acm';
import axios from 'axios';

const url = (interactionId: string, interactionToken: String) => 
  `https://discord.com/api/v8/interactions/${interactionId}/${interactionToken}/callback`;

export async function postInteraction(interactionId: string, interactionToken: string, msg: string) {
  const confirmUrl = url(interactionId, interactionToken);
  const body = {
    "type": 4,
    "data": {
      "content": msg,
      "flags": 64
    }
  };

  try {
    let res = await axios.post(confirmUrl, body);
    console.log('confirmed interaction result');
    return res.data;
  
  } catch (error) {
    console.log('error confirming interaction result: ', error);
    return;
  }
}
