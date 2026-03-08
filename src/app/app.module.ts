import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutesModule } from './app.routes';

import { AppComponent } from './app.component';
import { CharacterComponent } from './components/character/character.component';
import { PlanetComponent } from './components/planet/planet.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [AppComponent, SearchFormComponent, CharacterComponent, PlanetComponent],
  imports: [AppRoutesModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
