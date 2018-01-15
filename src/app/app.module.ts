import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
// importación de otros módulos de funcionalidad
import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
