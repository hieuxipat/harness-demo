import * as qs from 'qs';

export const objectToQuerystring = (obj: Record<string, unknown>): string => {
  return qs.stringify(obj);
};
