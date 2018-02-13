import { Component, OnInit, ViewChild } from "@angular/core";

//import { SAMPLE1 } from '../../mock-data';
import { TSampleXY } from "../../dataTypes";
import { ApplesService } from "../../apples.service";
import { BCanvasComponent } from "../../b-comps/b-canvas/b-canvas.component";

import { TNeuron } from "../../../MIA/neuronic";
import { element } from "protractor";

@Component({
  selector: "app-simple-neurone",
  templateUrl: "./simple-neurone.component.html",
  styleUrls: ["./simple-neurone.component.css"]
})
export class SimpleNeuroneComponent implements OnInit {
  public data: TSampleXY[];
  public neu1: TNeuron;
  @ViewChild(BCanvasComponent) bCanvas: BCanvasComponent;

  constructor(private appleService: ApplesService) {}

  ngOnInit() {
    this.getHeroes();
    this.neu1 = new TNeuron(2);
  }

  public onTest1() {
    console.log("onTest1()");
    console.log(this.bCanvas.width);
    const canvas = this.bCanvas;
    const thats = this;
    this.data.forEach(function(value: TSampleXY) {
      thats.drawApple(value);
    });
    const n1 = new TNeuron(1);
    n1.a = 1;
    n1.bias = 2;
    console.log(n1.calc());
  }

  public onDrawbackground() {
    const imgData = this.bCanvas.context.createImageData(
      this.bCanvas.widthPx,
      this.bCanvas.heightPx
    );
    const v: DataView = new DataView(imgData.data.buffer);
    const red = parseInt("FF0000FF", 16);
    const blue = parseInt("00FFFFFF", 16);
    let index = 0;
    for (let y = 0; y < imgData.height; y++) {
      for (let x = 0; x < imgData.width; x++) {
        if (x < 30) {
          v.setInt32(index, red);
          //this.setPixel(imgData, x, y, 255,0,0, 255);
        } else {
          //this.setPixel(imgData, x, y, 255, 255, 0,255);
        }
        //const col=(x<50)?red:blue;
        //v.setFloat32(index,col);
        index += 4;
      }
    }
    //let n0=v.getUint32(0);

    this.bCanvas.context.putImageData(imgData, 0, 0);
  }

  public onDrawbackground2() {
    const imgData = this.bCanvas.context.createImageData(
      this.bCanvas.widthPx,
      this.bCanvas.heightPx
    );
    const cellsize = 20;
    for (let i = 0; i < imgData.width; i += 2 * cellsize) {
      for (let j = 0; j < imgData.height; j += cellsize) {
        const diff = ((j / cellsize) % 2) * cellsize;
        for (
          let x = i + diff;
          x < i + diff + cellsize && x < imgData.width;
          x++
        ) {
          for (let y = j; y < j + cellsize; y++) {
            this.setPixel(imgData, x, y, 120, 120, 120, 255);
          }
        }
      }
    }
    this.bCanvas.context.putImageData(imgData, 0, 0);
  }

  public drawbackgroundNeu() {
    const imgData = this.bCanvas.context.createImageData(
      this.bCanvas.widthPx,
      this.bCanvas.heightPx
    );
    const v: DataView = new DataView(imgData.data.buffer);
    const red = parseInt("FF0000FF", 16);
    const blue = parseInt("00FFFFFF", 16);
    let index = 0;
    for (let y = 0; y < imgData.height; y++) {
      this.neu1.inputs[1] = y;
      for (let x = 0; x < imgData.width; x++) {
        this.neu1.inputs[0] = x;
        const rC = this.neu1.calc2();
        if (rC < 0) {
          v.setInt32(index, red);
        } else {
          v.setInt32(index, blue);
        }
        //const col=(x<50)?red:blue;
        //v.setFloat32(index,col);
        index += 4;
      }
    }
    this.bCanvas.context.putImageData(imgData, 0, 0);
  }

  public onLearnStep() {
    const thats = this;
    const din = [0, 0];
    const index = Math.floor(Math.random() * this.data.length);
    const elemento: TSampleXY = this.data[index];
    //Recorremos todos los samples
    thats.neu1.inputs[0] = elemento.x;
    thats.neu1.inputs[1] = elemento.y;
    const rC = thats.neu1.calc2();
    const rOk = thats.clasify(elemento);
    let e = rOk - rC; //rC-rOk; //
    e=e*0.5;
    console.log(`(${elemento.x.toFixed(2)}, ${elemento.y.toFixed(2)}) rC:${rC} rOk:${rOk}`);
    if (e !== 0) {
      din[0] = elemento.x;
      din[1] = elemento.y;
      this.neu1.adjust(e, din);
    }
    console.log(thats.neu1.showInfo());
    this.drawbackgroundNeu();
  }

  setPixel(imageData: ImageData, x, y, r, g, b, a) {
    const index = x + y * imageData.width;
    imageData.data[index * 4 + 0] = r;
    imageData.data[index * 4 + 1] = g;
    imageData.data[index * 4 + 2] = b;
    imageData.data[index * 4 + 3] = a;
  }

  getHeroes(): void {
    this.appleService.getApples(10).subscribe(apples => (this.data = apples));
    //this.data = this.appleService.getApples();
  }

  // Pinta una manzana en el canvas
  protected drawApple(apple: TSampleXY) {
    const r = 6;
    const rx = r + (apple.x - 0.5);
    const ry = r - (apple.x - 0.5);
    this.bCanvas.context.beginPath();
    const red = Math.floor(127 + apple.y * 127);
    const green = Math.floor(255 - apple.y * 127);
    this.bCanvas.context.fillStyle = `rgb(${red},${green},0)`;
    this.bCanvas.context.ellipse(
      apple.x * this.bCanvas.scaleX,
      apple.y * this.bCanvas.scaleY,
      rx,
      ry,
      0,
      0,
      2 * Math.PI
    );
    this.bCanvas.context.fill();
    this.bCanvas.context.stroke();
    //this.bCanvas.drawPoint(apple.x, apple.y);
  }

  //Clasifica manualmente las manzanas segun esas medidas en el tipo 0 o 1
  public clasify(apple: TSampleXY): number {
    return (apple.y > apple.x) ? 1 : -1;
  }
}
