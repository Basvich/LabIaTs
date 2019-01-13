import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tc2Component } from './tc2.component';

describe('Tc2Component', () => {
  let component: Tc2Component;
  let fixture: ComponentFixture<Tc2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
