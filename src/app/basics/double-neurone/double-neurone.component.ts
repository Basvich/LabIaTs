// Creado con ng generate component basics\doubleNeurone
/**
 * Poner funciones de relleno asyncrono y detección de fin
 */
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { TSampleXY } from "../../dataTypes";
import { ApplesService } from "../../apples.service";
import { BCanvasComponent } from "../../b-comps/b-canvas/b-canvas.component";
import { TNeuron, TPerceptron1, FuncsTransfer } from "../../../MIA/neuronic";
import * as neutils from "../../../MIA/neutils";

import { Chart } from 'chart.js';
import { ExitMachine } from '../../../MIA/neutils';

type TFClasify = (pair: TSampleXY) => number;

@Component({
  selector: 'app-double-neurone',
  templateUrl: './double-neurone.component.html',
  styleUrls: ['./double-neurone.component.css']
})
export class DoubleNeuroneComponent implements OnInit {
  private lastIndex = 0;
  private currLineIndex = 0;
  protected clasify: TFClasify;
  protected miErrorLimit=0.002;
  public data: TSampleXY[];
  public chart; // This will hold our chart info
  public perceptronNet: TPerceptron1;
  public currentError = 0;
  public numEpoch = 0;


  public isUnchanged = false;

  public FuncsClasify = [
    { f: this.clasify1Quart, nfo: 'Quadrant', tooltip:'Cuandrant' },
    { f: this.clasifyXor, nfo: 'Xor Function', tooltip:'2 cuadrants in romboid' },
    { f: this.clasifyCenterZone, nfo: 'center', tooltip:'Center zone' },
    { f: this.clasifyBand, nfo: 'band', tooltip:'Central band' }
  ];

  public netCfg = {
    nInternals: 2,
    clasify: this.FuncsClasify[0].f,
    v2: 4,
    minError:0.002,
    maxIteracciones:100000
  };

  @ViewChild(BCanvasComponent) bCanvas: BCanvasComponent;

  constructor(private appleService: ApplesService) {
    console.log('new');
    this.clasify = this.clasify1Quart;
  }

  ngOnInit() {
    this.getHeroes();
    this.perceptronNet = new TPerceptron1();
    this.perceptronNet.build(2, 2);
    this.initChart();
  }

  getHeroes(): void {
    this.appleService.getApples(48).subscribe(apples => (this.data = apples));
    /* this.data = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ]; */
  }

  //#region  respuseta eventos
  public onSetCfg(v: any) {
    console.log(v);
    console.log(this.netCfg.v2);
    //Sanitize
    this.netCfg.nInternals = this.clip(this.netCfg.nInternals, 1, 20);
    this.setCfg(this.netCfg);
    this.addNewLineGraph();
  }

  public onSelectClasify(idx: number) {
    this.netCfg.clasify = this.FuncsClasify[idx].f;
  }

  public onLearnStep() {
    const thats = this;
    const index = this.lastIndex++ % this.data.length; // Math.floor(Math.random() * this.data.length);
    const elemento: TSampleXY = this.data[index];
    const din = [elemento.x, elemento.y];
    const desired = thats.clasify(elemento);
    console.log(
      `in [${din[0].toFixed(2)}, ${din[1].toFixed(
        2
      )}] desired:${desired.toFixed(2)}`
    );
    this.perceptronNet.learn(desired, din);
    this.perceptronNet.showInfo();
    this.numEpoch++;

    /*  //Recorremos todos los samples
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
    console.log(thats.neu1.showInfo());*/
    this.drawbackgroundNeu();
    this.drawSamples();
    this.currentError = this.calcError2();
  }

  public onLearnStepX100() {
    const thats = this;
    const nTest = 400;
    this.executeLearnCicles(nTest);

    //console.log(`in [${din[0].toFixed(2)}, ${din[1].toFixed(2 )}] desired:${desired.toFixed(2)}` );
    //this.perceptronNet.showInfo();

    this.drawbackgroundNeu();
    this.drawSamples();
    this.currentError = this.calcError2();
    const nsam = { x: this.numEpoch, y: this.currentError };
    this.chart.data.datasets[this.currLineIndex].data.push(nsam);
    this.chart.update();
  }

  /** Ejecuta el ciclo de aprendizaje hasta un tope de intentos o se llega a un error
   * aceptable
   * @memberof DoubleNeuroneComponent
   */
  public onLearnToEnd() {
    const thats = this;
    const ended = () =>(this.numEpoch >= 100000) || (this.currentError<this.miErrorLimit);

    function cicle() {
      thats.executeLearnCicles(400);
      thats.drawbackgroundNeu();
      thats.drawSamples();
      thats.currentError = thats.calcError2();
      const nsam = { x: thats.numEpoch, y: thats.currentError };
      thats.chart.data.datasets[thats.currLineIndex].data.push(nsam);
      thats.chart.update();
    }
    neutils.smplUntil(ended, cicle, function(err) {
      if (err) console.error(err);
      console.log('OK');
    });
  }

  public onTest() {
    const tst = () => this.numEpoch > 4;
    const iteratee = () => console.log(this.numEpoch);
    neutils.smplUntil(tst, iteratee, function() {
      console.log('ok');
    });

    /*const thats = this;
    this.testAddDataChart();
    return;*/
    /*  function test(a: number[]) {
      thats.perceptronNet.inputs[0] = a[0];
      thats.perceptronNet.inputs[1] = a[1];
      thats.forceValues3();
      thats.perceptronNet.calcY();
      console.log(`test[${a[0]},${a[1]}] -> ${thats.perceptronNet.neuY.y}`);
    }
    test([0.05, 0.1]);
    thats.perceptronNet.showInfo();
    const desired = 0.01;
    this.perceptronNet.learn(desired, [0.05, 0.1]); */

    /* test([0.0,1.0]);
    thats.perceptronNet.showInfo();
    test([1.0,0.0]);
    thats.perceptronNet.showInfo();
    test([1.0,1.0]);
    thats.perceptronNet.showInfo(); */
  }

  public onTest2() {
    console.log('onTest2()');
    const tst = () => this.numEpoch > 4;
    const iteratee = () => {
      console.log(this.numEpoch++);
    };
    neutils.smplUntil(tst, iteratee, function() {
      console.log('ok');
    });
  }

  public onClearGraph() {
    this.chart.data.datasets.length = 0;
    this.addNewLineGraph();
    this.chart.update();
    //this.chart.data.datasets[0].data.length = 0;
  }
  //#endregion

  public drawbackgroundNeu() {
    const imgData = this.bCanvas.context.createImageData(
      this.bCanvas.widthPx,
      this.bCanvas.heightPx
    );
    const v: DataView = new DataView(imgData.data.buffer);
    const red = parseInt('FF0000FF', 16);
    const blue = parseInt('00FFFFFF', 16);
    const white = parseInt('FFFFFFFF', 16);
    const black = parseInt('101010FF', 16);
    let index = 0;
    const isx = 1 / this.bCanvas.scaleX;
    const isy = 1 / this.bCanvas.scaleY;
    for (let y = 0; y < imgData.height; y++) {
      this.perceptronNet.inputs[1] = y * isy;
      for (let x = 0; x < imgData.width; x++) {
        this.perceptronNet.inputs[0] = x * isx;
        const rC = this.perceptronNet.calcY();
        if (rC < -0.2) {
          v.setInt32(index, red);
        } else {
          if (rC > 0.2) {
            v.setInt32(index, blue);
          } else {
            if (Math.abs(rC) < 0.002) v.setInt32(index, black);
            else v.setInt32(index, white);
          }
        }
        //const col=(x<50)?red:blue;
        //v.setFloat32(index,col);
        index += 4;
      }
    }
    this.bCanvas.context.putImageData(imgData, 0, 0);
  }

  public drawSamples() {
    const canvas = this.bCanvas;
    const thats = this;
    this.data.forEach(function(value: TSampleXY) {
      //thats.drawApple(value);
      const color = thats.clasify(value) > 0 ? 'blue' : 'red';
      thats.drawSample(value, color);
    });
  }

  protected executeLearnCicles(nTest: number) {
    for (let i = 0; i < nTest; i++) {
      const index = this.lastIndex++ % this.data.length;
      const elemento: TSampleXY = this.data[index];
      const din = [elemento.x, elemento.y];
      const desired = this.clasify(elemento);
      this.perceptronNet.learn(desired, din);
    }
    this.numEpoch += nTest;
  }

  protected clip(number, min, max): number {
    return Math.max(min, Math.min(number, max));
  }

  protected drawSample(
    s: TSampleXY,
    color: string | CanvasGradient | CanvasPattern
  ) {
    this.bCanvas.context.beginPath();
    this.bCanvas.context.rect(
      s.x * this.bCanvas.scaleX - 2,
      s.y * this.bCanvas.scaleY - 2,
      4,
      4
    );
    this.bCanvas.context.fillStyle = color;
    this.bCanvas.context.fill();
    this.bCanvas.context.strokeStyle = 'black';
    this.bCanvas.context.stroke();
  }

  protected setCfg(a: any) {
    this.perceptronNet.build(2, this.netCfg.nInternals);
    this.clasify = this.netCfg.clasify;
    this.miErrorLimit=this.netCfg.minError;
    this.reset();
  }

  protected reset() {
    this.numEpoch = 0;
    //this.chart.data.datasets[0].data.length = 0;
  }

  protected forceValues() {
    let neu = this.perceptronNet.layer[0];
    neu.weigths[0] = 1;
    neu.weigths[1] = 1;
    neu.bias = -1.5;
    neu = this.perceptronNet.layer[1];
    neu.weigths[0] = 1;
    neu.weigths[1] = 1;
    neu.bias = -0.5;
    neu = this.perceptronNet.neuY;
    neu.weigths[0] = -2;
    neu.weigths[1] = 1;
    neu.bias = -0.5;
  }

  protected forceValues2() {
    let neu = this.perceptronNet.layer[0];
    neu.weigths[0] = 20;
    neu.weigths[1] = 20;
    neu.bias = -10;
    neu = this.perceptronNet.layer[1];
    neu.weigths[0] = -20;
    neu.weigths[1] = -20;
    neu.bias = 30;
    neu = this.perceptronNet.neuY;
    neu.weigths[0] = 20;
    neu.weigths[1] = 20;
    neu.bias = -30;
  }

  protected forceValues3() {
    let neu = this.perceptronNet.layer[0];
    neu.weigths[0] = 0.15;
    neu.weigths[1] = 0.2;
    neu.bias = 0.35;
    neu = this.perceptronNet.layer[1];
    neu.weigths[0] = 0.25;
    neu.weigths[1] = 0.3;
    neu.bias = 0.35;
    neu = this.perceptronNet.neuY;
    neu.weigths[0] = 0.4;
    neu.weigths[1] = 0.45;
    neu.bias = 0.6;
  }

  protected calcError2(): number {
    let res = 0;
    const thats = this;
    let n = 0;
    this.data.forEach(s => {
      const rCalc = thats.perceptronNet.calcY([s.x, s.y]);
      const rTeor = thats.clasify(s);
      n++;
      res += (rTeor - rCalc) * (rTeor - rCalc);
    });
    if (n > 0) {
      res = res / n;
    }
    return res;
  }

  protected initChart() {
    const ctx = document.getElementById('canvaschart');
    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'test',
            fillColor : this.getRandomColor(),
            data: [],
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              type: 'linear',
              display: true
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        },
        showLines: true
      }
    });
  }

  /** Añade una nueva grafica
   *
   * @protected
   * @memberof DoubleNeuroneComponent
   */
  protected addNewLineGraph() {
    const col=this.getRandomColor();
    const nDS = {
      label: 'test',
      borderColor: col,
      data: [],
      fill: false
    };
    //hats.chart.data.datasets[thats.currLineIndex].data.push(nsam);
    this.chart.data.datasets.push(nDS);
    this.currLineIndex = this.chart.data.datasets.length - 1; //Siempre escribimos en la última
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  protected testAddDataChart() {
    const data = [0, 1, 2, 3, 4, 5, 5, 4, 3, 2];
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  //Clasifica manualmente las manzanas segun esas medidas en el tipo 0 o 1
  public clasify1Quart(apple: TSampleXY): number {
    let b = apple.x > 0.35;
    b = b && apple.y > 0.35;
    //const b = apple.x === apple.y;
    return b ? 1 : 0;
  }

  public clasifyXor(apple: TSampleXY): number {
    let b = apple.y > apple.x; // /
    const c = apple.y > 1 - apple.x; // \
    b = b ? !c : c; //xor
    return b ? 1 : 0;
  }

  public clasifyCenterZone(apple: TSampleXY): number {
    let b = false;
    if (apple.x > 0.3 && apple.x < 0.7) {
      if (apple.y > 0.3 && apple.y < 0.7) b = true;
    }
    return b ? 1 : 0;
  }

  public clasifyBand(s: TSampleXY): number {
    let b = false;
    if (s.y > 0.2 * s.x + 0.2) {
      b = s.y < 0.2 * s.x + 0.6;
    }
    return b ? 1 : 0;
  }
}
