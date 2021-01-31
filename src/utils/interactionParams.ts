import { option } from '../interfaces/discordInteractions';

export const getParam = (name: string, options: option[]) => 
  options.find( option => 
    option.name === name
  )?.value;
