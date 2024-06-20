import { TestBed } from '@angular/core/testing';

import { PermissioncategoryService } from './permissioncategory.service';

describe('PermissioncategoryService', () => {
  let service: PermissioncategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissioncategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
