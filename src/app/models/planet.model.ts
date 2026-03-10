export interface PlanetModel {
  name: string;
  population: string;
  climate: string;
  gravity: string;
}

export const TATOOINE_MODEL_DATA: PlanetModel = {
  name: 'Tatooine',
  population: '200000',
  climate: 'arid',
  gravity: '1 standard'
} as const;

export const UTAPAU_MODEL_DATA: PlanetModel = {
  name: 'Utapau',
  population: '95000000',
  climate: 'temperate, arid, windy',
  gravity: '1 standard'
} as const;

export const MUSTAFAR_MODEL_DATA: PlanetModel = {
  name: 'Mustafar',
  population: '20000',
  climate: 'hot',
  gravity: '1 standard'
} as const;

export const NAL_HUTTA_MODEL_DATA: PlanetModel = {
  name: 'Nal Hutta',
  population: '7000000000',
  climate: 'temperate',
  gravity: '1 standard'
} as const;

export const MALASTARE_MODEL_DATA: PlanetModel = {
  name: 'Malastare',
  population: '2000000000',
  climate: 'arid, temperate, tropical',
  gravity: '1.56'
} as const;
