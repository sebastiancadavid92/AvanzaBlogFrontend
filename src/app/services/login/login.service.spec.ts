import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let controller:HttpTestingController
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let    userTest = {
    id: 1,
    username: 'testUserName',
    teamName: 'testTeam',
    teamId: 1
  }
 let loginData= {
    username: 'testUsername',
    password: 'password'
  }
  
  beforeEach(() => {

    authServiceMock = jasmine.createSpyObj('AuthService', { getUser: () => { userTest }, wathcUser: of(userTest), saveUser: undefined,deleteUser:undefined })
   
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[LoginService, MockProvider(AuthService,authServiceMock)]
    });
    service = TestBed.inject(LoginService);
    controller=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a suer', () => {
    let respo:any={};
    const url=`${environment.URLAPI}user/login/`
    service.login(loginData).subscribe({next:(result)=>{
      respo=result
    }})
  let req=controller.expectOne(url)
  req.flush(loginData)
  expect(authServiceMock.saveUser).toHaveBeenCalledWith(respo)
  expect(respo).toEqual(loginData)
  expect(req.request.method).toEqual('POST')
});

it('should log OUT a suer', () => {
  let respo:any={};
  const url=`${environment.URLAPI}user/logout/`
  service.logout().subscribe({next:(result)=>{
    respo=result
  }})
let req=controller.expectOne(url)
req.flush(loginData)
expect(authServiceMock.deleteUser).toHaveBeenCalled()
expect(respo).toEqual(loginData)
expect(req.request.method).toEqual('GET')
expect(req.request.withCredentials).toBeTrue()
});

});
