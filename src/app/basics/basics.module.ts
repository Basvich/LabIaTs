import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicsComponent } from './basics.component';
import { BasicsRoutingModule } from './basics-routing.module';
import { SimpleNeuroneComponent } from '../simple-neurone/simple-neurone.component';

@NgModule({
  imports: [
    CommonModule,
    BasicsRoutingModule
  ],
  declarations: [
    BasicsComponent,
    SimpleNeuroneComponent
  ]
})
export class BasicsModule { }
