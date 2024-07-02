import { TestBed } from '@angular/core/testing';

import { PermissioncategoryService } from './permissioncategory.service';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PermissioncategoryService', () => {
  let service: PermissioncategoryService;
  let httpMock:HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[PermissioncategoryService]
    });
    service = TestBed.inject(PermissioncategoryService);
    httpMock=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch and transform categories', () => {
    const mockCategories = [
      { id: 1, categoryname: 'CATEGORY_ONE' },
      { id: 2, categoryname: 'CATEGORY_TWO' }
    ];

    const transformedCategories = [
      { id: 1, categoryname: 'CATEGORY_ONE', verboseName: 'Category One' },
      { id: 2, categoryname: 'CATEGORY_TWO', verboseName: 'Category Two' }
    ];

    service.categories().subscribe(categories => {
      expect(categories).toEqual(transformedCategories);
    });

    const req = httpMock.expectOne(`${environment.URLAPI}categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should fetch and transform permissions', () => {
    const mockPermissions = [
      { id: 1, permissionname: 'PERMISSION_ONE' },
      { id: 2, permissionname: 'PERMISSION_TWO' }
    ];

    const transformedPermissions = [
      { id: 1, permissionname: 'PERMISSION_ONE', verboseName: 'Permission One' },
      { id: 2, permissionname: 'PERMISSION_TWO', verboseName: 'Permission Two' }
    ];

    service.permissions().subscribe(permissions => {
      expect(permissions).toEqual(transformedPermissions);
    });

    const req = httpMock.expectOne(`${environment.URLAPI}permissions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPermissions);
  });


});
