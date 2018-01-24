import { Component, OnInit } from '@angular/core';

import { SAMPLE1 } from '../../mock-data';

@Component({
  selector: 'app-simple-neurone',
  templateUrl: './simple-neurone.component.html',
  styleUrls: ['./simple-neurone.component.css']
})
export class SimpleNeuroneComponent implements OnInit {
  public data= SAMPLE1;

  constructor() { }
  ngOnInit() {
  }

}
