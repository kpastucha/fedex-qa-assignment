import { CharacterModel } from './character.model';
import { PlanetModel } from './planet.model';

export interface SwapiItemModel {
  properties: CharacterModel | PlanetModel;
}

export interface SwapiResponseModel {
  result: SwapiItemModel[];
}
