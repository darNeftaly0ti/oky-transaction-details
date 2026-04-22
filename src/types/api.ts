// Rick and Morty GraphQL API — TypeScript interfaces.
// The UI still speaks in terms of "transactions", but each entity is a Character.

export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface LocationRef {
  id: string | null;
  name: string;
  dimension?: string | null;
  type?: string | null;
}

export interface EpisodeRef {
  id: string;
  name: string;
  episode: string;
  air_date: string;
}

export interface Character {
  id: string;
  name: string;
  status: CharacterStatus;
  species: string;
  type?: string | null;
  gender: string;
  image: string;
  created: string;
  origin: LocationRef | null;
  location: LocationRef | null;
  episode?: EpisodeRef[];
}

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharactersPayload {
  info: PageInfo;
  results: Character[] | null;
}

// Query response shapes
export interface CharactersData {
  characters: CharactersPayload | null;
}

export interface CharacterData {
  character: Character;
}

export interface StatsData {
  total: { info: Pick<PageInfo, "count"> } | null;
  alive: { info: Pick<PageInfo, "count"> } | null;
  dead: { info: Pick<PageInfo, "count"> } | null;
}

// Query variables
export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export interface CharactersVars {
  page?: number;
  filter?: CharacterFilter;
}

export interface CharacterVars {
  id: string;
}
