import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BCanvasComponent } from './b-canvas.component';

describe('BCanvasComponent', () => {
  let component: BCanvasComponent;
  let fixture: ComponentFixture<BCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
