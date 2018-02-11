import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tc2Component } from './tc2/tc2.component';
import { BCanvasComponent } from './b-canvas/b-canvas.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Tc2Component, BCanvasComponent],
  exports: [Tc2Component, BCanvasComponent]
})
export class BCompsModule { }
