import { Option, IModalSubmissionData } from '../interfaces/DiscordInteractions';

export const getParam = (name: string, options: Option[]) => 
  options.find( option => 
    option.name === name
  )?.value;

/** Parses a param to true or false. Defaults to false. */
export const getBooleanParam = (name: string, options: Option[]) => !!getParam(name, options);

export const chooseHunterId = (userId: string, options: Option[]): string => {
  const passedInHunterId = getParam('hunter', options);
  return passedInHunterId ? passedInHunterId : userId;
}
