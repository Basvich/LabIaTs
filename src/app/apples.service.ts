import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { TSampleXY } from './dataTypes';
import { SAMPLE1 } from './mock-data';

@Injectable()
export class ApplesService {
  private scale=100;
  constructor() { }

  public getApples(n: number): Observable<TSampleXY[]> {
    const res: Array<TSampleXY>=this.buildApples(n);
    return  of(res);
    //return of(SAMPLE1);
  }

  private buildApples(n: number): TSampleXY[] {
    const res: TSampleXY[]=new Array(n);
    for (let i=0; i<n; i++) {
      res[i]= {x: 0.0+ this.scale* Math.random(), y: 0.0+this.scale *Math.random()};
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

}
