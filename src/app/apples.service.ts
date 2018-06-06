import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { TSampleXY } from './dataTypes';
import { SAMPLE1 } from './mock-data';

@Injectable()
export class ApplesService {
  private scale=1;
  private seed=1;
  constructor() { }

  public getApples(n: number): Observable<TSampleXY[]> {
    const res: Array<TSampleXY>=this.buildApples(n);
    return  of(res);
    //return of(SAMPLE1);
  }

  public getApplesXor(n:number): Observable<TSampleXY[]> {
    const res: Array<TSampleXY>=this.builInX(n);
    return  of(res);
  }

  private buildApples(n: number): TSampleXY[] {
    this.seed=1;
    const res: TSampleXY[]=new Array(n);
    for (let i=0; i<n; i++) {
      //res[i]= {x: 0.0+ this.scale* Math.random(), y: 0.0+this.scale *Math.random()};
      res[i]= {x: 0.0+ this.scale* this.pseRandom(), y: 0.0+this.scale * this.pseRandom()};
    }
    /*let i=0;
    for(let x=0.2;x<=0.8;x+=0.2){
      for(let y=0.25; y<=0.75; y+=0.25){
        res[i]={x:x, y:y};
        i++;
      }
    }*/
    return res;
  }

  pseRandom():number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }


  private builInX(n:number):TSampleXY[]{
    const res:TSampleXY[]=new Array(4);
    res[0]={x:0.1,y:0.1};
    res[1]={x:0.9,y:0.1};
    res[2]={x:0.9,y:0.9};
    res[3]={x:0.9,y:0.1};
    return res;
  }

}
