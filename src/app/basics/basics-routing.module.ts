import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicsComponent } from './basics.component';

import {SimpleNeuroneComponent} from './simple-neurone/simple-neurone.component';

const routes: Routes = [
  {
    path: '',
    component: BasicsComponent,
    children: [
      {path: 'simpleNeuron', component: SimpleNeuroneComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicsRoutingModule { }
