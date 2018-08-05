import { Component } from '@angular/core';

@Component({
  template:  `
    <nav>
      <a routerLink="./simpleNeuron" ngbTooltip="Simple neurona clasificadora">Una neurona</a>
      <a routerLink="./doubleNeuron" routerLinkActive="active" ngbTooltip="Red neuronal clasificadora multicapa">Multicapa</a>
      <!--<a routerLink="./otros" routerLinkActive="active">otros</a>-->
    </nav>
    <router-outlet></router-outlet>
  `
})
export class BasicsComponent {
}
