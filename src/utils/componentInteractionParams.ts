
export const parseCustomIdComponentInteraction = (customId: string): string => customId.split('-').shift();

export const parseCustomIdParams = (customId: string): string[] => customId.split('-').slice(1);