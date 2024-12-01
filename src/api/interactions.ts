import axios from 'axios';
import { applicationId } from '../config.json';
const url = (interactionId: string, interactionToken: string) => 
  `https://discord.com/api/v8/interactions/${interactionId}/${interactionToken}/callback`;

const followupUrl = (interactionToken: string) => 
`https://discord.com/api/v8/webhooks/${applicationId}/${interactionToken}`;

export async function postInteraction(interactionId: string, interactionToken: string, data: any) {
  const confirmUrl = url(interactionId, interactionToken);
  const body = {
    "type": 4,
    data
  };


  try {
    let res = await axios.post(confirmUrl, body);
    console.log('confirmed interaction result');
    return res.data;
  
  } catch (error) {
    console.log('error confirming interaction result: ', JSON.stringify(error, null, 2));
    return;
  }
}

export async function postInteractionModal(interactionId: string, interactionToken: string, data: any) {
  const confirmUrl = url(interactionId, interactionToken);

  try {
    let res = await axios.post(confirmUrl, data);
    console.log('confirmed interaction result', res.status);
    return res.data;
  
  } catch (error) {
    console.log('bftest error confirming interaction result: ');
    console.log(JSON.stringify(error, null, 2));
    return;
  }
}

export async function followup(interactionToken: string, data: any) {
  const confirmUrl = followupUrl(interactionToken);

  try {
    let res = await axios.post(confirmUrl, data);
    console.log('confirmed followup result');
    return res.data;
  
  } catch (error) {
    console.log('error followup result: ', error);
    return;
  }
}

