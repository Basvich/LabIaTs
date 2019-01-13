import { TestBed, inject } from '@angular/core/testing';

import { ApplesService } from './apples.service';

describe('ApplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplesService]
    });
  });

  it('should be created', inject([ApplesService], (service: ApplesService) => {
    expect(service).toBeTruthy();
  }));
});
