import { Component } from '@angular/core';

@Component({
  template:  `
    <h3>Basics</h3>
    <nav>
      <a routerLink="./simpleNeuron" routerLinkActive="active">Una neurona</a>
      <a routerLink="./doubleNeuron" routerLinkActive="active">Dos neuronas</a>
      <a routerLink="./otros" routerLinkActive="active">otros</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class BasicsComponent {
}
