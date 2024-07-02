import { ComponentFixture, TestBed } from '@angular/core/testing';



import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginService } from '../../../services/login/login.service';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { authUser } from '../../models/user';

fdescribe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>
  let loginServiceMock:jasmine.SpyObj<LoginService>
  let routerMock:jasmine.SpyObj<Router>
  let userTest:authUser|undefined;


  beforeEach(async () => {

    userTest = {
      id: 1,
      username: 'testUserName',
      teamName: 'testTeam',
      teamId: 1
    }



    loginServiceMock=jasmine.createSpyObj('LoginService', {
      logout: of('logout'),
    })
 authServiceMock = jasmine.createSpyObj('AuthService', { getUser: () => { userTest }, wathcUser: of(userTest), saveUser: undefined })
   

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers:[
        provideRouter([]),
        MockProvider(LoginService,loginServiceMock),
        MockProvider(AuthService,authServiceMock)

      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarComponent);
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});
