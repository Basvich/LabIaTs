import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-b-canvas',
  template: '<canvas #idcanvas ></canvas>',
  styles: ['canvas { border: 1px solid #000; width: 100%;  height: 100%}']
})
export class BCanvasComponent implements OnInit, AfterViewInit  {

  public context: CanvasRenderingContext2D;
  public scaleX: number;
  public scaleY: number;
  public widthPx: number;
  public heightPx: number;
  // a reference to the canvas element from our template
  @ViewChild('idcanvas') public canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 200;
  @Input() public height = 200;
  @Input() public maxX = 1;
  @Input() public maxy = 1;
  constructor() { }

  ngOnInit() {
    let canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    //canvasEl.width = this.width;
    //canvasEl.height = this.height;
  }

  ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.context = canvasEl.getContext('2d');

      // scale y component
      //context.scale(1, 0.5)
      //this.context.translate(canvasEl.width / 2, canvasEl.height / 2);
    //return;
    try {
<<<<<<< HEAD
      this.scaleX=1;//canvasEl.width;
      this.scaleY=1;//canvasEl.height;
      this.heightPx=canvasEl.height;
      this.widthPx=canvasEl.width;
=======
      this.scaleX=canvasEl.width;
      this.scaleY=canvasEl.height;
      this.heightPx=canvasEl.height;
      this.widthPx=canvasEl.width;
    // set the width and height
      //canvasEl.width = this.width;
      //canvasEl.height = this.height;
>>>>>>> origin/develop
    }catch (error) {
      console.error(error);
    }
  }

  public drawPoint(x: number, y: number) {
    const canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    console.log(`width:${canvasEl.width} height:${canvasEl.height}`);
    const x2= x*this.scaleX; // x*this.width; //
    const y2= y*this.scaleY;
     this.context.beginPath();
     this.context.arc(x2, y2, 2, 0, Math.PI);
     this.context.stroke();
  }

}
