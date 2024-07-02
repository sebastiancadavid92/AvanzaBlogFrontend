import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EditPostComponent } from './edit-post.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { MockProvider } from 'ng-mocks';
import Swal from 'sweetalert2';
import { Post, newPost } from '../../shared/models/post';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let postServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const mockPost: newPost = {
    title: 'Sample Post',
    content: 'This is a sample post content.',
    html: '<p>This is a sample post content.</p>',
    permission: {
      PUBLIC: 'READ_ONLY',
      AUTHOR: 'EDIT',
      TEAM: 'EDIT',
      AUTHENTICATED: 'READ_ONLY'
    }
  };

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', ['getPost', 'updatePost']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      paramMap: of(convertToParamMap({ id: '1' }))
    };

    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});