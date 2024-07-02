import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginService } from '../../../services/login/login.service';
import { Router, RouterPreloader, provideRouter } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { authUser } from '../../models/user';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatdialogComponent } from '../matdialog/matdialog.component';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let loginServiceMock: jasmine.SpyObj<LoginService>;
  let routerMock: jasmine.SpyObj<Router>;
  let userTest: authUser | undefined;
  let observable: BehaviorSubject<authUser>;

  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    userTest = {
      id: 1,
      username: 'testUserName',
      teamName: 'testTeam',
      teamId: 1,
    };
    observable = new BehaviorSubject<authUser>(userTest);

    loginServiceMock = jasmine.createSpyObj('LoginService', {
      logout: of('logout'),
    });
    authServiceMock = jasmine.createSpyObj('AuthService', {
      getUser: userTest,
      wathcUser: observable,
      saveUser: undefined,
    });

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: MatDialog, useValue: matDialogSpy },
        MockProvider(LoginService, loginServiceMock),
        MockProvider(AuthService, authServiceMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component = fixture.componentInstance;

    mockDialogRef.afterClosed.and.returnValue(of('closed'));
    matDialogSpy.open.and.returnValue(mockDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from the authService', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceMock.getUser).toHaveBeenCalled();
    expect(authServiceMock.wathcUser).toHaveBeenCalled();
    expect(component.user).toEqual(userTest as authUser);
  });

  it('in case of error on the subscribtion user have to be null', () => {
    authServiceMock.wathcUser.and.returnValue(
      throwError(() => new Error('Test error'))
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.user).toBeNull();
  });

  it('should redirect home when calling home()', () => {
    spyOn(routerMock, 'navigate');
    component.home();
    fixture.detectChanges();
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should unsubscribe when the component die', () => {
    expect(component.Userwathcer?.closed).toBeFalse();
    component.ngOnDestroy();
    expect(component.Userwathcer?.closed).toBeTrue();
  });

  it('isNewpost should call to router.isActive', () => {
    spyOn(routerMock, 'isActive');
    component.isNewPost();
    fixture.detectChanges();

    expect(routerMock.isActive).toHaveBeenCalledWith('newpost', {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  });

  it('newPost() should redirect to newpost page', () => {
    spyOn(routerMock, 'navigate');
    component.newPost();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['newpost']);
  });

  // fit('should open dialog', () => {
  //   spyOn(matDialogSpy, 'open');

  //   component.renderDialog({ login: true });
  //   // expect(matDialogSpy.open).toHaveBeenCalledWith(MatdialogComponent, { data: { login: true } });
  //   //expect(mockDialogRef.afterClosed).toHaveBeenCalled();
  // });


/*   it('should show an alert if the user wants to logout', fakeAsync(() => {
    
    spyOn(Swal, 'mixin').and.returnValue(Swal);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as SweetAlertResult);
    spyOn(routerMock,'navigate')
    fixture.detectChanges()
    component.logoutb()
    tick(1000)
    expect(Swal.mixin).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'warning',
        title: jasmine.any(String),
        text: jasmine.any(String)
      }))
    expect(loginServiceMock.logout).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        text:"logout successful",
      }))
    expect(routerMock.navigate).toHaveBeenCalled()
    
  })) */

  it('should handle error comming from the backend',  fakeAsync(() => {
    loginServiceMock.logout.and.returnValue(throwError(()=>{new Error('Error Test')}))
    spyOn(Swal, 'mixin').and.returnValue(Swal);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as SweetAlertResult);
    fixture.detectChanges()
    component.logoutb()
    tick(1000)
    expect(Swal.mixin).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'warning',
        title: jasmine.any(String),
        text: jasmine.any(String)
      }))
    expect(loginServiceMock.logout).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: "error",
        title: "Oops...Something went wrong!",
      }))



  }));

  it('should display login and register buttons when user is not logged in', () => {
    authServiceMock.getUser.and.returnValue(null);
    component.ngOnInit()
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('img[alt="Login"]');
    const registerButton = fixture.nativeElement.querySelector('img[alt="Register"]');

    expect(loginButton).toBeTruthy();
    expect(registerButton).toBeTruthy();
  });

  it('should display username and logout button when user is logged in', () => {
    fixture.detectChanges();

    const usernameElement = fixture.nativeElement.querySelector('p');
    const logoutButton = fixture.nativeElement.querySelector('img[alt="Logout"]');

    expect(usernameElement.textContent).toContain(userTest?.username);
    expect(logoutButton).toBeTruthy();
  });


  it('should navigate to home when home button is clicked', () => {
    spyOn(component, 'home');
    const homeButton = fixture.nativeElement.querySelector('[data-testid="home"]');
    homeButton.click();
    expect(component.home).toHaveBeenCalled();
  });

  it('should open the new post dialog when new post button is clicked', () => {

    spyOn(component, 'newPost');
    component.ngOnInit()
    fixture.detectChanges();

    const newPostButton = fixture.nativeElement.querySelector('img[alt="Nuevo Post"]');
    newPostButton.click();
    expect(component.newPost).toHaveBeenCalled();
  });


  it('should logout when logout button is clicked', () => {
    spyOn(component, 'logoutb');
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('img[alt="Logout"]');
    logoutButton.click();
    expect(component.logoutb).toHaveBeenCalled();
  });


});
