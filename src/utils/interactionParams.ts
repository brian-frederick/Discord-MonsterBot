import { Option } from '../interfaces/discordInteractions';

export const getParam = (name: string, options: Option[]) => 
  options.find( option => 
    option.name === name
  )?.value;

export const chooseHunterId = (userId: string, options: Option[]): string => {
  const passedInHunterId = getParam('hunter', options);
  return passedInHunterId ? passedInHunterId : userId;
}
