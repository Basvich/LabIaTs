//import { NOTIMP } from "dns";


type TransFunc= (n: number) => number;

export class TNeuron {
  public a: number;
  public bias=0.5;
  public inputs: Array<number>;
  public weigths: Array<number>;
  public transf: TransFunc=tranferStep;

  constructor(nInputs:number){
    this.inputs=new Array(nInputs);
    this.weigths=new Array(nInputs);
    const w=1/nInputs;
    for(let i=0; i<nInputs;i++){
      this.weigths[i]=w;
    }
  }
  public calc(): number {
    return this.a+this.bias;
  }

  public showInfo():string{
    return `[${this.weigths[0].toFixed(2)},${this.weigths[1].toFixed(2)}] bias:${this.bias.toFixed(2)}`;
  }

  public calc2(): number{
    const f=this.inputs.length;
    let res=0;
    for(let i= 0; i<f; i++){
      res+=this.inputs[i]*this.weigths[i];
    }
    res+=this.bias;
    return this.transf(res);
  }

  public adjust(e:number, p:Array<number>){
    for(let i=0; i<this.inputs.length; i++){
      this.weigths[i]+=e*p[i];
    }
    this.bias=this.bias+e;
  }

}

/**
 * Funcion de transferencia escalon (no continua)
 * @param {number} a
 * @returns {number}
 */
function tranferStep(a: number): number {
  return (a<0)?-1: 1;
}


/** Funcion de transferencia con ligera
 * pendiente (continua)
 *
 * @param {number} a
 * @returns {number}
 */
function transferStep2(a:number):number{
  if(a<-0.5) return -1;
  if(a>0.5) return  1;
  return  (2*a);
}

export let FuncsTransfer=[{f:tranferStep, nfo:'Simple Step'},{f:transferStep2, nfo:'Slope step'}];
