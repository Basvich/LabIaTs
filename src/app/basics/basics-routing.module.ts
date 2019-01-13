import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicsComponent } from './basics.component';

import {SimpleNeuroneComponent} from './simple-neurone/simple-neurone.component';
import {DoubleNeuroneComponent} from './double-neurone/double-neurone.component';

const routes: Routes = [
  {
    path: '',
    component: BasicsComponent,
    children: [
      {path: 'simpleNeuron', component: SimpleNeuroneComponent},
      {path: 'doubleNeuron', component: DoubleNeuroneComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicsRoutingModule { }
