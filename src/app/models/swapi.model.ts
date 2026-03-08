export interface CharacterProperties {
  name: string;
  gender: string;
  birth_year: string;
  eye_color: string;
  skin_color: string;
}

export interface PlanetProperties {
  name: string;
  population: string;
  climate: string;
  gravity: string;
}

export interface SwapiItem {
  properties: CharacterProperties | PlanetProperties;
}

export interface SwapiResponse {
  result: SwapiItem[];
}
