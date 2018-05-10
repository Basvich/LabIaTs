

export type IFProccessData<T> = (dataIn: T) => void;
export type ISimpleCallback = (err?: Error, result?: any) => void;  // before:  export interface ISimpleCallback { (err?: Error, result?: any): void; }
export type ISImpleProccessCallback = (err?: Error, dataStatus?: any, nextDataIn?: any) => void;
export type ISimpleStep = (data: any, callback: ISimpleCallback) => void;
export type ISImpleProcessStatus<T> = (dataStatus: any, callback: ISImpleProccessCallback) => IFProccessData<T>;



 /**
  * LLama a setInmediate si existe o a setTimeout
  * @param func
  */
 export function toNextTick(func: Function) {
  //if (window.proc
  if (window.setImmediate) {
    window.setImmediate(func);
  } else {
    setTimeout(func, 0);
  }
}

/**Sirve para abortar algun paso de la maquina de estados, sin ser realmente un error (equivalente a un EAbort) */
export class ExitMachine extends Error {
  constructor(public data?: any) {
    super();
  }
}

/**
   * Una maquinita de estados simples, en el que cada estado puede pasar solo al siguiente en una lista.
   * cada estado tiene que devoler una función que es la que acepta los tipos de datos de entrada.
   * @template T
   * @param {ISImpleProcessStatus<T>[]} arrFunc - estados
   * @param {(error: any, data: any) => void} endFunc - funcion final cuando se acabe o hay error.
   * @param {*} [startData] - Datos iniciales de estado para arrancar
   * @returns {IFProccessData<T>}
   */
  function simpleSerialMachine<T>(arrFunc: ISImpleProcessStatus<T>[],
     endFunc: (error: any, data: any) => void, startData?: any): IFProccessData<T> {
    if (!arrFunc || arrFunc.length <= 0 || !endFunc) throw new Error('Incorrect simpleSerialMachine');
    arrFunc.forEach(function (value) {
      if (typeof value !== 'function') throw new Error('Incorrect simpleSerialMachine function');
    });

    let currStep: number = 0;
    const currentData: any = startData;
    let currFuncStep: IFProccessData<T> = null; //funcion actual de entrada

    const miCallback: ISImpleProccessCallback = function (err: any, dataStatus: any, dataNext: T) {
      if (err || (currStep >= arrFunc.length)) {
        let nerr = err;
        if (nerr && (nerr instanceof ExitMachine))
          nerr = undefined;
        return endFunc(nerr, dataStatus);
      }
      //Saltamos al siguiente status
      currFuncStep = arrFunc[currStep++](currentData, miCallback);
      if (typeof dataNext !== 'undefined') miDataInStep(dataNext);
    };
    currFuncStep = arrFunc[currStep++](currentData, miCallback);
    const miDataInStep: IFProccessData<T> = function (dataIn: T) {
      try {
        //console.log("[simpleSerialMachine] - %s - %s() datain:'%s'", arrFunc[currStep - 1].name, currFuncStep.name, dataIn);
        currFuncStep(dataIn);
      } catch (eerr) {
        currStep = arrFunc.length + 1;
        endFunc(eerr, currentData);
      }
    };
    return miDataInStep;
  }


  /**
   * Fuertenemente inspirado el prototipo de async.concatSeries. Ejecuta iteratee con cada elemento de la colleccion, de forma
   * secuencial.
   * Con el uso posible de un iterator como coleccion, es posible pasarle literalmente una coleccion sin fin, que funcionará correctamente. (bueno, salvo por el result que crece...)
   * en cuanto ocurre un error, salta a endFunc.
   * Solo se devuelve en el array final los datos distintos de nulo.
   * @param coll
   * @param iteratee
   * @param endFunc
   */
  export function simpleConcatSeries(coll: Array<any> | Iterator<any>, iteratee: ISimpleStep, endFunc: (error: any, data: Array<any>) => void) {
    let it: Iterator<any>;
    if (typeof iteratee !== 'function') throw new Error('Incorrect iteratee function');
    if (typeof endFunc !== 'function') throw new Error('Incorrect endFunc function');
    if (!coll) return endFunc(null, null);  //No hay colleccion, no devolvemos nada
    if (Array.isArray(coll)) {
      it = arrayIterator(coll);//(<Array<any>>coll).values();
    } else
      it = coll;
    let itRes = it.next();
    let currData: any;
    const returnData: Array<any> = [];
    if (!itRes.done) currData = itRes.value;
    else return endFunc(null, returnData); //Nos vino una coleccion vacia, devolvemos colleccion vacia

    function miCallback(err: any, data: any) {
      if (!err) {
        if (data) returnData.push(data);
      }
      itRes = it.next();
      if (err || (itRes.done)) {
        //return endFunc(err, returnData);  //Sincrono con el ultimo resultado
        return toNextTick(() => endFunc(err, returnData)); //Asincrono del ultimo resultado
      } else {  //Seguimos
        currData = itRes.value;
        toNextTick(executeStep); //Async forced
      }
    }
    /**Devuelve un iterador de un array. Seguro que ya existe, pero mientras lo encuentro o no, devuelvo este. (nota: array.values() no existe en chrome...) */
    function* arrayIterator(arr: Array<any>) {
      if (arr) { for (const e of arr) { yield e; } }
    }

    function executeStep() {
      try {
        iteratee(currData, miCallback);
      } catch (errr) {
        endFunc(errr, null);
      }
    }
    executeStep();
  }

  /**
   * Repite la función test hasta que iteratee devuelva true
   *
   * @export
   * @param {Function} test
   * @param {ISimpleCallback} iteratee
   * @param {ISimpleCallback} [callback]
   */
  export function smplUntil(test:Function, iteratee:Function, endFunc?:ISimpleCallback){
    if(!test || !iteratee) return;

    function excecuteStep(){
      try{
        console.log('excecuteStep()');
        iteratee();
        if(!test()){
          toNextTick(excecuteStep);
        }else{
          if(endFunc) endFunc(null);
        }
      }catch(errr){
        if(endFunc) endFunc(errr);
      }
    }
    toNextTick(excecuteStep);
  }
