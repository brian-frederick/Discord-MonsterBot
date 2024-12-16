import { CUSTOM_ID_LIBRARY_IND } from "./specialMovesHelper";

export const parseCustomIdName = (customId: string): string | undefined => customId.split('_').shift();

export const parseCustomIdParams = (customId: string): string[] => customId.split('_').slice(1);

export const hasLibraryIndicatorParam = (customId: string): boolean => customId.split('_')?.includes(CUSTOM_ID_LIBRARY_IND);