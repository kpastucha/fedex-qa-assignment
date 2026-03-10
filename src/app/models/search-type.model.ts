export const SEARCH_TYPE_DATA = {
  PEOPLE: 'people',
  PLANETS: 'planets'
} as const;

export type SearchType = (typeof SEARCH_TYPE_DATA)[keyof typeof SEARCH_TYPE_DATA];
