import { Component, Input } from '@angular/core';
import { PlanetModel } from '../../models/planet.model';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html'
})
export class PlanetComponent {
  @Input() planet!: PlanetModel;
}
