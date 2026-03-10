import { Component, Input } from '@angular/core';
import { CharacterModel } from '../../models/character.model';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html'
})
export class CharacterComponent {
  @Input() character!: CharacterModel;
}
