import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from './login.component';
import { LoginService } from '../../services/login/login.service';
import swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceMock: any;
  let routerMock: any;
  let dialogRefMock: any;

  beforeEach(async () => {
    loginServiceMock = jasmine.createSpyObj('LoginService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should validate email pattern', () => {
    const email = component.email;
    email.setValue('invalid-email');
    expect(email.valid).toBeFalsy();
    email.setValue('valid.email@domain.com');
    expect(email.valid).toBeTruthy();
  });

  it('should validate form before login', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.logIn();
    expect(component.invalidForm).toBeFalse();
    expect(component.loginForm.valid).toBeFalse();
  });


});