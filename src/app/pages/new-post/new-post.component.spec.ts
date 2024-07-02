import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { NewPostComponent } from './new-post.component';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { Router } from '@angular/router';
import { authUser } from '../../shared/models/user';
import { MockComponent, MockProvider } from 'ng-mocks';
import { EditPostComponent } from '../edit-post/edit-post.component';

describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let authServiceMock: any;
  let postServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser']);
    postServiceMock = jasmine.createSpyObj('PostService', ['newPost']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NewPostComponent,MockComponent(EditPostComponent)],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});