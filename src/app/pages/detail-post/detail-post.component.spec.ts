import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { DetailPostComponent } from './detail-post.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../shared/models/post';
import { MockComponent, MockProvider } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { CommentService } from '../../services/comment/comment.service';
import { CommentListComponent } from '../../shared/Component/comment-list/comment-list.component';
import { NewCommentComponent } from '../../shared/Component/new-comment/new-comment.component';

describe('DetailPostComponent', () => {
  let component: DetailPostComponent;
  let fixture: ComponentFixture<DetailPostComponent>;
  let activatedRouteMock: any;
  let postServiceMock: any;
  let authServiceMock: any;
  let postData: Post;


  beforeEach(async () => {
    postData = {
      id: 1,
      author_name: "John Doe",
      author_id: 123,
      title: "Sample Post Title",
      excerpt: "This is a short excerpt of the post.",
      team_name: "Development Team",
      team_id: 456,
      timestamp: "2024-07-02T12:00:00Z",
      comments: 5,
      content: "This is the full content of the sample post.",
      html: "<p>This is the HTML content of the sample post.</p>",
      likes: 100,
      permission: {
        PUBLIC: "EDIT",
        AUTHOR: "EDIT",
        TEAM: "NONE",
        AUTHENTICATED: "READ_ONLY"
      },
      edit: true,
      liked: false
    };

    activatedRouteMock = {
      paramMap: of(convertToParamMap({ id: '1' }))
    };

    
    postServiceMock = jasmine.createSpyObj('PostService', ['getPost']);
    postServiceMock.getPost.and.returnValue(of(postData));

    authServiceMock = jasmine.createSpyObj('AuthService', ['getUser']);
    authServiceMock.getUser.and.returnValue({ /* mock user data */ });

    await TestBed.configureTestingModule({
      imports: [DetailPostComponent,MockComponent(CommentListComponent),MockComponent(NewCommentComponent)],
      declarations: [],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        Location
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load post data on init', () => {
    expect(component.bPost).toEqual(postData);
  });

});