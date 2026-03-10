export interface CharacterModel {
  name: string;
  gender: string;
  birth_year: string;
  eye_color: string;
  skin_color: string;
}

export const SKYWALKER = 'Skywalker';

export const LUKE_MODEL_DATA: CharacterModel = {
  name: `Luke ${SKYWALKER}`,
  gender: 'male',
  birth_year: '19BBY',
  eye_color: 'blue',
  skin_color: 'fair'
} as const;

export const ANAKIN_MODEL_DATA: CharacterModel = {
  name: `Anakin ${SKYWALKER}`,
  gender: 'male',
  birth_year: '41.9BBY',
  eye_color: 'blue',
  skin_color: 'fair'
} as const;

export const SHMI_MODEL_DATA: CharacterModel = {
  name: `Shmi ${SKYWALKER}`,
  gender: 'female',
  birth_year: '72BBY',
  eye_color: 'brown',
  skin_color: 'fair'
} as const;
