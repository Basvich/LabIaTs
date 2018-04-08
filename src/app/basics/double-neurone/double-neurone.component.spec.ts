import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleNeuroneComponent } from './double-neurone.component';

describe('DoubleNeuroneComponent', () => {
  let component: DoubleNeuroneComponent;
  let fixture: ComponentFixture<DoubleNeuroneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleNeuroneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleNeuroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
