import { Component, OnInit } from '@angular/core';

// Simple component test
@Component({
  selector: 'app-tc2',
  template: `<p> tc2 works!</p>`,
  styleUrls: ['./tc2.component.css']
})
export class Tc2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
