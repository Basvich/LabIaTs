import { randomBytes } from 'crypto';
import { isNumber, isArray } from 'util';
import { forEach } from '@angular/router/src/utils/collection';

//import { NOTIMP } from "dns";

type TransFunc = (n: number) => number;

export class TNeuron {
  protected funcSum;

  protected funcGetIns;
  /** valor calculado de la neurona
   * @type {number}
   * @memberof TNeuron
   */
  public y: number;
  public bias = 0.5;
  public inputs: Array<number | TNeuron>;
  public weigths: Array<number>;
  public transf: TransFunc = tranferStep;
  /** El error que se propaga hacia atras con el algoritmo backProp. Llamado Ek a veces
   * @type {number}
   * @memberof TNeuron
   */
  public errBackProp: number;

  constructor(ins: Array<TNeuron | number>) {
    if (!ins) return;
    this.buildFrom(ins);
  }

  public toString() {
    let res = `w: [${this.weigths[0].toFixed(2)},${this.weigths[1].toFixed(
      2
    )}],${this.bias.toFixed(2)} `;
    res += `in: [${this.funcGetIns(this.inputs[0]).toFixed(
      2
    )},${this.funcGetIns(this.inputs[1]).toFixed(2)}] y=${this.y.toFixed(2)}`;
    return res;
  }

  protected sumFromNumbers(ins: Array<number>): number {
    let res = 0;
    for (let i = 0; i < this.inputs.length; i++) {
      res += <number>this.inputs[i] * this.weigths[i];
    }
    return res;
  }

  protected sumFromNeu(ins: Array<TNeuron>) {
    let res = 0;
    for (let i = 0; i < this.inputs.length; i++) {
      res += (<TNeuron>this.inputs[i]).y * this.weigths[i];
    }
    return res;
  }

  protected getInNeu(ins: TNeuron) {
    return ins.y;
  }

  protected getInNum(ins: number) {
    return ins;
  }

  public buildFrom(fromInputs: Array<number | TNeuron>) {
    if (!fromInputs || fromInputs.length === 0)
      throw new Error('invalid inputs');
    const isnNums = typeof fromInputs[0] === 'number';
    this.weigths = new Array(fromInputs.length);
    for (let i = 0; i < this.weigths.length; i++) this.weigths[i] = 0;
    this.inputs = fromInputs;
    //Segun el tipo de datos de entrada
    if (isnNums) {
      this.funcSum = this.sumFromNumbers;
      this.funcGetIns = a => a;
    } else {
      this.funcSum = this.sumFromNeu;
      this.funcGetIns = (a: TNeuron) => a.y;
    }
    this.initRnd();
  }

  /** Calcula la salida de la neurona
   * @returns {number}
   * @memberof TNeuron
   */
  public calc(): number {
    let res = 0;
    /*for (let i = 0; i < f; i++) {
      res += this.inputs[i] * this.weigths[i];
    }*/
    res = this.funcSum();
    res += this.bias;
    this.y = this.transf(res);
    return this.y;
  }

  public showInfo(): string {
    return `[${this.weigths[0].toFixed(2)},${this.weigths[1].toFixed(
      2
    )}] bias:${this.bias.toFixed(2)}`;
  }

  /** Ajuste simple para un perceptron
   * @param {number} e
   * @param {Array<number>} p
   * @memberof TNeuron
   */
  public adjust(e: number, p: Array<number>) {
    for (let i = 0; i < this.inputs.length; i++) {
      this.weigths[i] += e * p[i];
    }
    this.bias = this.bias + e * 1;
  }

  /** Ajusta los pesos de las conexiones entrantes
   * @param lek - Cuanto se ajusta
   */
  public adjustBackProp(lek: number) {
    if (lek === 0) return;
    if (!isFinite(lek)) {
      throw new Error('Invalid lek');
    }
    for (let i = 0; i < this.inputs.length; i++) {
      const vari = lek * this.funcGetIns(this.inputs[i]);
      const nW = this.weigths[i] + vari;
      this.weigths[i] = nW;
      if (isNaN(this.weigths[i])) {
        throw new Error('Invalid operation');
      }
    }
    //El bias es como un peso con entrada 1
    this.bias = this.bias + lek;
  }

  public initRnd() {
    if (this.weigths && this.weigths.length > 0) {
      const ww = 2; //2/this.weigths.length;  //sirve para emprezar con pesos normalizados
      const ofs = 1; //1/this.weigths.length;
      this.weigths.forEach((value: number, index: number, array: number[]) => {
        //array[index] = Math.random() * ww - ofs;
        array[index]=TNeuronalNetwork.pseRandom()*ww-ofs;
      });
    }
    this.bias = TNeuronalNetwork.pseRandom()*2-1;//Math.random() * 2 - 1;
  }
}

export class TNeuronalNetwork {
  public static seed = 1;
  public tasaAprendizage = 0.15;

  /**Falso random para poder hacer comparaciones */
  public static pseRandom() {
    const x = Math.sin(TNeuronalNetwork.seed++) * 10000;
    return x - Math.floor(x);
  }

  public showInfo() {}


}

/** Red neuronal perceptron, con 2 capas (entradas y una neurona de salida)
 * Funcion de transferencia igual para todas las neuronas.
 * Tiene varias entradas y una única salida.
 * Todas las entradas van a todas las neuronas
 * @export
 * @class TPerceptron1
 */
export class TPerceptron1 extends TNeuronalNetwork {
  public inputs: Array<number>;
  layer: Array<TNeuron>;
  derivative: Function;
  /** La neurona de salida, conectada a todas las de entrada
   * @type {TNeuron}
   * @memberof TPerceptron1
   */
  neuY: TNeuron;

  /** Calcula el resultado final de la red
   *
   * @returns {number}
   * @memberof TPerceptron1
   */
  public calcY(currInputs?: Array<number>): number {
    if (!this.inputs) throw new Error('Not initialized');
    if (currInputs)
      for (let i = 0; i < currInputs.length; i++)
        this.inputs[i] = currInputs[i];

    this.layer.forEach(function(value: TNeuron) {
      value.calc();
      //console.log(value.toString());
    });
    //Finalmente la neurona de salida
    const y = this.neuY.calc();
    //console.log(this.neuY.toString());
    return y;
  }

  public build(nImputs: number, nNeurons: number | Array<number>) {
    const func = transferSigmoid;
    TNeuronalNetwork.seed=1;
    let nneus: number;
    if (isArray(nNeurons)) nneus = nNeurons[0];
    else nneus = <number>nNeurons;

    this.derivative = sigmoidDer;
    this.inputs = new Array(nImputs);
    for (let i = 0; i < this.inputs.length; i++) this.inputs[i] = 0;
    this.layer = new Array(nneus);
    for (let i = 0; i < nneus; i++) {
      const n = new TNeuron(null);
      n.buildFrom(this.inputs);
      n.transf = func; //tranferStep0;
      this.layer[i] = n;
    }
    this.neuY = new TNeuron(this.layer);
    this.neuY.transf = func;
  }

  /** realiza un pazo de apredizaje comparado con
   * el resultado actual
   * @param {number} desired
   * @memberof TPerceptron1
   */
  public learn(desired: number, currInputs: Array<number>) {
    for (let i = 0; i < currInputs.length; i++) this.inputs[i] = currInputs[i];
    this.calcY(); //Calculamos el resultado de la red
    const error = desired - this.neuY.y; //El error

    //Cambio pesos neurona de salida.
    //Dk=error*g'(salida)
    const Ek = error * this.derivative(this.neuY.y); //error*this.neuY.y*(1-this.neuY.y);
    //console.log(`current error:${error.toFixed(2)} Ek:${Ek.toFixed(2)}`);
    const lek = this.tasaAprendizage * Ek;
    this.neuY.adjustBackProp(lek); //Cambio pesos neurona salida
    //Cambio pesos capa interna (=entrada aqui)
    for (let i = 0; i < this.layer.length; i++) {
      const neu: TNeuron = this.layer[i];
      const Eki = this.derivative(neu.y) * this.neuY.weigths[i] * Ek; //neu.y*(1-neu.y)*this.neuY.weigths[i]*Ek;
      neu.adjustBackProp(this.tasaAprendizage * Eki);
    }
  }

  /** Muestra una información de depuración.
   */
  public showInfo() {
    console.log(
      `in: [${this.inputs[0]}, ${
        this.inputs[1]
      }] layer ${this.layer[0].toString()} ${this.layer[1].toString()}`
    );
    console.log(`out: ${this.neuY.toString()}`);
  }
}

/**
 * Perceptron multicapa, cada capa esta conectada a la siguiente
 * de forma que todas las neuronas de una capa lo estan con todas las siguientes
 *
 * @export
 * @class TPerceptron
 * @extends {TNeuronalNetwork}
 */
export class TPerceptronn extends TPerceptron1 {
  protected layers: Array<Array<TNeuron>>;

  public build(nImputs: number, nNeurons: Array<number>) {
    TNeuronalNetwork.seed=1;
    const func = transferSigmoid;
    this.derivative = sigmoidDer;
    this.inputs = new Array(nImputs);
    for (let i = 0; i < this.inputs.length; i++) this.inputs[i] = 0;
    this.layers = new Array(nNeurons.length);
    let bfrom: Array<number | TNeuron> = this.inputs;
    for (let i = 0; i < nNeurons.length; i++) {
      //Toda las capas
      const nneus = nNeurons[i];
      this.layers[i] = new Array(nneus);
      const currLayer = this.layers[i];
      for (let j = 0; j < nneus; j++) {
        const n = new TNeuron(null);
        n.buildFrom(bfrom);
        n.transf = func;
        currLayer[j] = n;
      }
      bfrom = <Array<TNeuron>>currLayer;
    }
    this.neuY = new TNeuron(this.layers[this.layers.length - 1]); //La de salida
    this.neuY.transf = func;
  }

  /** Calcula el resultado final de la red
   *
   * @returns {number}
   * @memberof TPerceptron1
   */
  public calcY(currInputs?: Array<number>): number {
    if (!this.inputs) throw new Error('Not initialized');
    if (currInputs)
      for (let i = 0; i < currInputs.length; i++)
        this.inputs[i] = currInputs[i];

    for (const currLayer of this.layers) {
      currLayer.forEach(function(value: TNeuron) {
        value.calc();        //console.log(value.toString());
      });
    }
    //Finalmente la neurona de salida
    const y = this.neuY.calc();
    //console.log(this.neuY.toString());
    return y;
  }

  /** realiza un pazo de apredizaje comparado con
   * el resultado actual
   * @param {number} desired
   * @memberof TPerceptron1
   */
  public learn(desired: number, currInputs: Array<number>) {
    for (let i = 0; i < currInputs.length; i++) this.inputs[i] = currInputs[i];
    this.calcY(); //Calculamos el resultado de la red
    const error = desired - this.neuY.y; //El error

    //Cambio pesos neurona de salida.
    //Dk=error*g'(salida)
    const Ek = error * this.derivative(this.neuY.y); //error*this.neuY.y*(1-this.neuY.y);
    //console.log(`current error:${error.toFixed(2)} Ek:${Ek.toFixed(2)}`);
    const lek = this.tasaAprendizage * Ek;
    this.neuY.errBackProp = Ek;
    this.neuY.adjustBackProp(lek); //Cambio pesos neurona salida
    //Vamos cambiando los pesos de las capas hacia atras
    let layer1 = this.layers[this.layers.length - 1];

    //Cambio pesos capa ultima (que solo conecta con la salida)
    for (let i = 0; i < layer1.length; i++) {
      const neu: TNeuron = layer1[i];
      const Eki = this.derivative(neu.y) * this.neuY.weigths[i] * Ek; //neu.y*(1-neu.y)*this.neuY.weigths[i]*Ek;
      neu.errBackProp=Eki;
      neu.adjustBackProp(this.tasaAprendizage * Eki);
    }
    let layer2;
    //Ajustamos las demas capas hacia atras, presuponemos que cada neurona esta conectada con
    for (let j = this.layers.length - 2; j >= 0; j--) {
      layer2 = layer1;
      layer1 = this.layers[j];
      CopyErrorK(layer1, layer2);
      for (let i = 0; i < layer1.length; i++) {
        //El error es Ej=Oj·(1-Oj)·SUM(Ek*Wjk) Donde Oj es la salida de la neurona j
        const neu: TNeuron = layer1[i];
        const Eki = this.derivative(neu.y) * neu.errBackProp;
        neu.adjustBackProp(this.tasaAprendizage * Eki);
      }
    }

    /** Translada los errores de l2 a l1, hacia atras, y segun los pesos de conexiones
     * @param layer1
     * @param layer2
     */
    function CopyErrorK(l1: TNeuron[], l2: TNeuron[]) {
      for (let i = 0; i < l1.length; i++) {
        const curr = l1[i];
        curr.errBackProp = 0;
        for (let j = 0; j < l2.length; j++) {
          const lastNeu = l2[j];
          curr.errBackProp += lastNeu.weigths[i] * lastNeu.errBackProp;
        }
      }
    }

    function sumWeigths(layer: TNeuron[], fromInput: number): number {
      let res = 0;
      res = layer.reduce(
        (prev: number, curr: TNeuron) => (res += curr.weigths[fromInput]),
        res
      );
      return res;
    }
  }
}

/**
 * Funcion de transferencia escalon (no continua)
 * @param {number} a
 * @returns {number}
 */
function tranferStep(a: number): number {
  return a < 0 ? -1 : 1;
}

function tranferStep0(a: number): number {
  return a < 0 ? 0 : 1;
}

/** Funcion de transferencia con ligera
 * pendiente (continua)
 *
 * @param {number} a
 * @returns {number}
 */
function transferStep2(a: number): number {
  if (a < -0.5) return -1;
  if (a > 0.5) return 1;
  return 2 * a;
}

/**
 * Devuelve valores entre [0,1]
 * Su derivada
 * f1'(x)=f1(x)(1-f1(x));
 * @param {number} a
 * @returns
 */
function transferSigmoid(a: number) {
  //=1/(1+e^-x)
  const c = 1 + Math.exp(-a);
  return 1 / c;
}

/**
 * Ojo, a=sigmoid(a)
 * @param {number} a
 * @returns
 */
function sigmoidDer(a: number) {
  return a * (1 - a); //(1-transferSigmoid(a));
}

/** tangente hiperbolica (=sigmoide escalada). Devuelve entre [-1,1]
 * f2'(x)=2f1(x)(1-f1(x))=2f1'(x)
 * @param {number} a
 * @returns {number}
 */
function transferTanh(a: number): number {
  //=(2/(1+e^-2x))-1=(1-e^-x)/(1+e^-x)
  return Math.tanh(a);
}

function tanhDer(a: number) {
  const b = Math.tanh(a);
  return 1 - a * a; //ojo, squizas sea (1-a)(1-a)
}

function transferRelu(a: number): number {
  return Math.max(0, a);
}

export let FuncsTransfer = [
  { f: tranferStep, nfo: "Simple Step" },
  { f: transferStep2, nfo: "Slope step" },
  { f: transferTanh, nfo: "tanh" }
];
