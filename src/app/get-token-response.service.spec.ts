import { TestBed } from '@angular/core/testing';

import { GetTokenResponseService } from './get-token-response.service';

describe('GetTokenResponseService', () => {
  let service: GetTokenResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTokenResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
