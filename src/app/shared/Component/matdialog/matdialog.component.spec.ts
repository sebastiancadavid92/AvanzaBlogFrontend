import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatdialogComponent } from './matdialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../../../pages/login/login.component';
import { SignupComponent } from '../../../pages/signup/signup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockComponent } from 'ng-mocks';

describe('MatdialogComponent', () => {
  let component: MatdialogComponent;
  let fixture: ComponentFixture<MatdialogComponent>;
  let dialogRef: MatDialogRef<MatdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [NoopAnimationsModule,MatdialogComponent,MockComponent(LoginComponent),MockComponent(SignupComponent)],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { login: true } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatdialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should toggle loginFlag correctly', () => {
    component.toogle();
    expect(component.loginFlag).toBeFalse();
    component.toogle();
    expect(component.loginFlag).toBeTrue();
  });

  it('should display login component when loginFlag is true', () => {
    component.loginFlag = true;
    fixture.detectChanges();
    const loginComponent = fixture.debugElement.query(By.directive(LoginComponent));
    expect(loginComponent).not.toBeNull();
    const signupComponent = fixture.debugElement.query(By.directive(SignupComponent));
    expect(signupComponent).toBeNull();
  });

  it('should display signup component when loginFlag is false', () => {
    component.loginFlag = false;
    fixture.detectChanges();
    const signupComponent = fixture.debugElement.query(By.directive(SignupComponent));
    expect(signupComponent).not.toBeNull();
    const loginComponent = fixture.debugElement.query(By.directive(LoginComponent));
    expect(loginComponent).toBeNull();
  });

  it('should call fromChild and toggle when signup emits loginPage', () => {
    spyOn(component, 'fromChild').and.callThrough();
    spyOn(component, 'toogle').and.callThrough();

    component.loginFlag = false;
    fixture.detectChanges();

    const signupComponentDebug = fixture.debugElement.query(By.directive(SignupComponent));
    signupComponentDebug.triggerEventHandler('loginPage', null);
    expect(component.fromChild).toHaveBeenCalled();
    expect(component.toogle).toHaveBeenCalled();
    expect(component.loginFlag).toBeTrue();
  });

  it('should handle dialogRef correctly', () => {
    expect(component.dialogRef).toBe(dialogRef);
  });

});