import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
// importación de otros módulos de funcionalidad
import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import {ApplesService} from './apples.service';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HomeModule, // el módulo funcional para la 'página home'
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApplesService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
