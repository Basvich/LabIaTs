import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { TSampleXY } from './dataTypes';
import { SAMPLE1 } from './mock-data';

@Injectable()
export class ApplesService {

  constructor() { }

  public getApples(n: number): Observable<TSampleXY[]> {
    const res: Array<TSampleXY>=this.buildApples(n);
    return  of(res);
    //return of(SAMPLE1);
  }

  private buildApples(n: number): TSampleXY[] {
    const res: TSampleXY[]=new Array(n);
    for (let i=0; i<n; i++) {
      res[i]= {x: 0.1+ Math.random()*0.9, y: 0.1+Math.random()*0.9};
    }
    return res;
  }

}
