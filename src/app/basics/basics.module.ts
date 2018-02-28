import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {BCompsModule} from '../b-comps/b-comps.module';

import { BasicsComponent } from './basics.component';
import { BasicsRoutingModule } from './basics-routing.module';
import { SimpleNeuroneComponent } from './simple-neurone/simple-neurone.component';
import { Tc2Component } from '../b-comps/tc2/tc2.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    BCompsModule,
    BasicsRoutingModule
  ],
  declarations: [
    BasicsComponent,
    SimpleNeuroneComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BasicsModule { }
