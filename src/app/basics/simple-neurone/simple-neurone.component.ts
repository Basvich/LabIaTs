import { Component, OnInit, ViewChild } from '@angular/core';

//import { SAMPLE1 } from '../../mock-data';
import { TSampleXY } from '../../dataTypes';
import {ApplesService} from '../../apples.service';
import {BCanvasComponent} from '../../b-comps/b-canvas/b-canvas.component';

@Component({
  selector: 'app-simple-neurone',
  templateUrl: './simple-neurone.component.html',
  styleUrls: ['./simple-neurone.component.css']
})
export class SimpleNeuroneComponent implements OnInit {
  public data: TSampleXY[];
  @ViewChild(BCanvasComponent) bCanvas: BCanvasComponent;

  constructor(private appleService: ApplesService) {

   }

  ngOnInit() {
    this.getHeroes();
  }

  public onTest1() {
    console.log('onTest1()');
    console.log(this.bCanvas.width);
    const canvas=this.bCanvas;
    const thats=this;
    this.data.forEach(function(value: TSampleXY){
      thats.drawApple(value);
    });
  }

  getHeroes(): void {
    this.appleService.getApples(10)
      .subscribe(apples => this.data = apples);
    //this.data = this.appleService.getApples();
  }

  protected drawApple(apple: TSampleXY) {
    const r=6;
    const rx=r+(apple.x-0.5);
    const ry=r-(apple.x-0.5);
    this.bCanvas.context.beginPath();
    const red= Math.floor(127+apple.y*127);
    const green= Math.floor(255-apple.y*127);
    this.bCanvas.context.fillStyle=`rgb(${red},${green},0)`;
    this.bCanvas.context.ellipse(apple.x*this.bCanvas.scaleX, apple.y*this.bCanvas.scaleY, rx, ry, 0, 0, 2 * Math.PI);
    this.bCanvas.context.fill();
    this.bCanvas.context.stroke();
    //this.bCanvas.drawPoint(apple.x, apple.y);
  }
}
