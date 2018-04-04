import { randomBytes } from "crypto";
import { isNumber } from "util";

//import { NOTIMP } from "dns";

type TransFunc = (n: number) => number;

export class TNeuron {

  protected funcSum;

  protected funcGetIns;
  /** Calor calculado de la neurona
   * @type {number}
   * @memberof TNeuron
   */
  public y:number;
  public bias = 0.5;
  public inputs: Array<number | TNeuron>;
  public weigths: Array<number>;
  public transf: TransFunc = tranferStep;

  constructor(ins:Array<TNeuron | number>) {
    if(!ins) return;
    this.buildFrom(ins);
  }

  public toString(){
    let res=`weights:[${this.weigths[0]},${this.weigths[1]}],${this.bias} `;
    res+=`inputs:[${this.funcGetIns(this.inputs[0])},${this.funcGetIns(this.inputs[1])}] y=${this.y}`;
    return res;
  }

  protected sumFromNumbers(ins:Array<number>):number{
     let res=0;
     for(let i=0;i<this.inputs.length;i++){
       res+=(<number>this.inputs[i])*this.weigths[i];
     }
     return  res;
  }

  protected sumFromNeu(ins:Array<TNeuron>){
    let res=0;
     for(let i=0;i<this.inputs.length;i++){
       res+=(<TNeuron>this.inputs[i]).y*this.weigths[i];
     }
     return  res;
  }

  protected getInNeu(ins:TNeuron){
    return  ins.y;
  }

  protected getInNum(ins:number){
    return  ins;
  }

  public buildFrom(fromInputs:Array<number | TNeuron>){
    if(!fromInputs || fromInputs.length===0) throw new Error('invalid inputs');
    const isnNums= (typeof fromInputs[0] ==='number');
    this.weigths=new Array(fromInputs.length);
    for(let i=0;i<this.weigths.length;i++)
       this.weigths[i]=0;
    this.inputs=fromInputs;
    //Segun el tipo de datos de entrada
    if(isnNums) {
      this.funcSum=this.sumFromNumbers;
      this.funcGetIns=(a)=>a;
    }else{
      this.funcSum=this.sumFromNeu;
     this.funcGetIns=(a:TNeuron)=>a.y;
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
    res=this.funcSum();
    res += this.bias;
    this.y=this.transf(res);
    return this.y;
  }

  public showInfo(): string {
    return `[${this.weigths[0].toFixed(2)},${this.weigths[1].toFixed(
      2
    )}] bias:${this.bias.toFixed(2)}`;
  }

  /*public calc2(): number{
    const f=this.inputs.length;
    let res=0;
    for(let i= 0; i<f; i++){
      res+=this.inputs[i]*this.weigths[i];
    }
    res+=this.bias;
    return this.transf(res);
  }*/

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

  public adjustBackProp(lek:number){
    if(!isFinite(lek)){
      throw new Error('Invalid lek');
    }
    for(let i=0;i<this.inputs.length;i++){
      const nW=this.weigths[i]+lek*this.funcGetIns(this.inputs[i]);
      this.weigths[i]=nW;
      if(isNaN(this.weigths[i])){
        throw new Error('Invalid operation');
      }
    }
    //El bias es como un peso con entrada 1
    this.bias=this.bias+lek;
  }

  public initRnd() {
    if (this.weigths && this.weigths.length>0){
      const ww=2;  //2/this.weigths.length;  //sirve para emprezar con pesos normalizados
      const ofs=1;  //1/this.weigths.length;
      this.weigths.forEach((value: number, index: number, array: number[]) => {
        array[index] = Math.random() * ww - ofs;
      });
    }
    this.bias =  Math.random() * 2 - 1;
  }




}

export class TNeuronalNetwork {
  public tasaAprendizage=0.3;
}

/** Red neuronal perceptron, con 2 capas (entradas y una neurona de salida)
 * Funcion de transferencia igual para todas las neuronas.
 * Tiene varias entradas y una única salida.
 * Todas las entradas van a todas las neuronas
 * @export
 * @class TPerceptron1
 */
export class TPerceptron1 extends TNeuronalNetwork {
  inputs: Array<number>;
  layer: Array<TNeuron>;
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
  public calcY(): number {
    if (!this.inputs) throw new Error('Not initialized');

    this.layer.forEach(function(value: TNeuron) {
      value.calc();
      //console.log(value.toString());
    });
    //Finalmente la neurona de salida
    const y=this.neuY.calc();
    //console.log(this.neuY.toString());
    return y;
  }

  public build(nImputs: number, nNeurons: number) {
    this.inputs = new Array(nImputs);
    for(let i=0;i<this.inputs.length;i++) this.inputs[i]=0;
    this.layer = new Array(nNeurons);
    for (let i = 0; i < nNeurons; i++) {
      const n = new TNeuron(null);
      n.buildFrom(this.inputs);
      n.transf=tranferStep0;
      this.layer[i] = n;
    }
    this.neuY = new TNeuron(this.layer);
    this.neuY.transf=tranferStep0;

  }

  /** realiza un pazo de apredizaje comparado con
   * el resultado actual
   * @param {number} desired
   * @memberof TPerceptron1
   */
  public learn(desired:number, currInputs:Array<number>){
    for(let i=0;i<currInputs.length;i++) this.inputs[i]=currInputs[i];
    this.calcY();  //Calculamos el resultado de la red
    const error=desired-this.neuY.y;  //El error
    //Cambio pesos neurona de salida. El 2 es por usar la funcion tanh
    //Dk=error*g'(salida)
    const Ek=error*2*this.neuY.y*(1-this.neuY.y);
    const lek=this.tasaAprendizage*Ek;
    this.neuY.adjustBackProp(lek);  //Cambio pesos neurona salida
   //Cambio pesos capa interna (=entrada aqui)
    for(let i=0;i<this.layer.length;i++){
      const neu:TNeuron=this.layer[i];
      const Eki=2*neu.y*(1-neu.y)*this.neuY.weigths[i]*Ek;
      neu.adjustBackProp(this.tasaAprendizage*Eki);
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
function transferSigmoid(a:number){
  //=1/(1+e^-x)

  const c=1+Math.exp(-a);
  return 1/c;
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

function transferRelu(a: number): number {
  return Math.max(0, a);
}

export let FuncsTransfer = [
  { f: tranferStep, nfo: 'Simple Step' },
  { f: transferStep2, nfo: 'Slope step' },
  { f: transferTanh, nfo: 'tanh' }
];
