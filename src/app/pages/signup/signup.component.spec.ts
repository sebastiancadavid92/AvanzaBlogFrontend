import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { SingupService } from '../../services/singup/singup.service';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let singupServiceMock:jasmine.SpyObj<SingupService>
  beforeEach(async () => {

    singupServiceMock=jasmine.createSpyObj('SinupService',{register:of({}),checkEmail:of({emailtook:false}), checkUsername:of({usernametook:false})})
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers:[MockProvider(SingupService,singupServiceMock)]

    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
