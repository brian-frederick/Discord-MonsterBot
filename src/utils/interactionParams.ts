import { Option } from '../interfaces/DiscordInteractions';

export const getParam = (name: string, options: Option[]) => 
  options.find(option => 
    option.name === name
  )?.value;

export const getRequiredStringParam = (name: string, options: Option[]): string => {
  const param = options.find(option => option.name === name)?.value;

  if (!param) {
    throw new Error(`Missing required param: ${name}`);
  }

  return param;
}

export const getRequiredNumberParam = (name: string, options: Option[]): number => {
  const param = options.find(option => option.name === name)?.value;

  if (!param) {
    throw new Error(`Missing required param: ${name}`);
  }

  return parseInt(param);
}

/** Parses a param to true or false. Defaults to false. */
export const getBooleanParam = (name: string, options: Option[]) => !!getParam(name, options);

export const chooseHunterId = (userId: string, options: Option[]): string => {
  const passedInHunterId = getParam('hunter', options);
  return passedInHunterId ? passedInHunterId : userId;
}