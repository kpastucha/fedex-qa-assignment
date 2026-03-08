import { Component, Input } from '@angular/core';
import { CharacterProperties } from '../../models/swapi.model';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html'
})
export class CharacterComponent {
  @Input() character!: CharacterProperties;
}
