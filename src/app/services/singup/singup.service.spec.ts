import { TestBed } from '@angular/core/testing';

import { SingupService } from './singup.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SingUp } from '../../shared/models/user';
import {environment} from '../../../environments/environment'

describe('SingupService', () => {

  let controller:HttpTestingController;
  let service: SingupService;

  const signUpData: SingUp = {
    username: 'testUser123',
    email: 'test@example.com',
    password: 'securePassword123!',
    passwordconfirmation: 'securePassword123!'
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[SingupService]
    });
    service = TestBed.inject(SingupService);
    controller=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shouLd check email', (fn) => {
    let data={emailtook:false};

    const url=`${environment.URLAPI}user/api/checkemail/test@email.com/`

    service.checkEmail('test@email.com').subscribe(
      (result)=>{
        expect(result).toEqual(data)
        fn()
      }
    )
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('GET')
    request.flush(data)
  });

  it('shouLd check username', (fn) => {
    let data={usernametook:false};

    const url=`${environment.URLAPI}user/api/checkusername/usernametest/`

    service.checkUsername('usernametest').subscribe(
      (result)=>{
        expect(result).toEqual(data)
        fn()
      }
    )
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('GET')
    request.flush(data)
  });


  it('should register a user', (fn) => {
    let user:any;
    const url=`${environment.URLAPI}user/register/`

    service.register(signUpData).subscribe(
      (result)=>{
        user=result
        expect(user).toEqual(signUpData)
        fn()
      }
    )
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('POST')
    request.flush(signUpData)
  });

  
});
