import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleNeuroneComponent } from './simple-neurone.component';

describe('SimpleNeuroneComponent', () => {
  let component: SimpleNeuroneComponent;
  let fixture: ComponentFixture<SimpleNeuroneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleNeuroneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleNeuroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
