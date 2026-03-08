import { Component, Input } from '@angular/core';
import { PlanetProperties } from '../../models/swapi.model';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html'
})
export class PlanetComponent {
  @Input() planet!: PlanetProperties;
}
