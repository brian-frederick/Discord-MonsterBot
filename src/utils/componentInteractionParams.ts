
export const parseCustomIdName = (customId: string): string | undefined => customId.split('_').shift();

export const parseCustomIdParams = (customId: string): string[] => customId.split('_').slice(1);