// TODO: combine with movesHelper.js after making it a ts file.

export function undefinedIfEmptyString(val?: string): undefined | string {
  if (!val?.length) {
    return undefined;
  }

  return val;
}