import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider, MockComponent } from 'ng-mocks'
import { BpostComponent } from './bpost.component';
import { PostService } from '../../../services/post/post.service';
import { AuthService } from '../../../services/auth/auth.service';
import { of, throwError } from 'rxjs'
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { Post } from '../../models/post';
import Swal, { SweetAlertResult } from 'sweetalert2';
import swal from 'sweetalert2';
import { By } from '@angular/platform-browser';
import { authUser } from '../../models/user';

describe('BpostComponent', () => {
  let component: BpostComponent;
  let authServiceMock: jasmine.SpyObj<AuthService> 
  let postServiceMock: jasmine.SpyObj<PostService>;

  let routerMock: jasmine.SpyObj<Router>
  let fixture: ComponentFixture<BpostComponent>;
  let ActiverouterMock: jasmine.SpyObj<ActivatedRoute>
  let postExample: Post;
  let userTest: authUser | undefined;


  beforeEach(async () => {
    postExample = {
      id: 123,
      author_name: "Juan Pérez",
      author_id: 456,
      title: "Mi primer post",
      excerpt: "Este es el resumen de mi primer post.",
      team_name: "Equipo Alpha",
      team_id: 789,
      timestamp: "2024-06-27T12:00:00Z",
      comments: 5,
      content: "Aquí va el contenido completo del post, debo  para poder hacer un buen test este contenido debe tener mas de docisentas caracteres diferentes. Hasta este memonte solo tiene 174, es decir que dobo agregar ....",
      html: "<p>Aquí va el contenido HTML del post...</p>",
      likes: 10,
      permission: {
        PUBLIC: "READ_ONLY",
        AUTHOR: "EDIT",
        TEAM: "NONE",
        AUTHENTICATED: "EDIT"
      },
      edit: true,
      liked: true
    };


    userTest = {
      id: 1,
      username: 'testUserName',
      teamName: 'testTeam',
      teamId: 1
    }



    postServiceMock = jasmine.createSpyObj('PostService', {
      getPost: of(postExample),
      like: of('like'),
      dislike: of('dislike'),
      deletePost: of({})
    })
    authServiceMock = jasmine.createSpyObj('AuthService', { getUser: () => { userTest }, wathcUser: of(userTest), saveUser: undefined })
    ActiverouterMock = jasmine.createSpyObj('ActivatedRoute', { outlet: undefined })
    await TestBed.configureTestingModule({
      imports: [BpostComponent],
      declarations: [],
      providers: [
        provideRouter([]),
        MockProvider(PostService, postServiceMock),
        MockProvider(AuthService, authServiceMock)
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BpostComponent);
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>
    component = fixture.componentInstance;
    authServiceMock.getUser.and.returnValue(userTest);

    component.bPost = postExample;
    component.ngOnChanges({})
    fixture.detectChanges();

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user from the Authservice', () => {
    expect(authServiceMock.getUser).toHaveBeenCalled()
    expect(component.user).toEqual(userTest)
    expect(component.url).toBeTruthy()
  })

  it('should load the data into the componnet variables', () => {
    expect(component.edit).toEqual(postExample.edit)
    expect(component.content).toEqual(postExample.content)
    expect(component.liked()).toEqual(postExample.liked)
    expect(component.excerpt).toEqual(postExample.excerpt)
    expect(component.likes()).toEqual(postExample.likes)
    expect(component.html).toEqual(postExample.html)
    expect(component.id).toEqual(postExample.id)
  })

  it('should handle a dislike', () => {
    component.likeHandler()
    expect(component.liked()).toEqual(false)
    expect(component.likes()).toEqual(postExample.likes - 1)
  })

  it('should handle a like ', () => {
    component.liked.set(false)
    component.likeHandler()
    expect(component.liked()).toEqual(true)
    expect(component.likes()).toEqual(postExample.likes + 1)
  })

  it('comment() should redirect to postdetial', () => {
    spyOn(routerMock, 'navigate')
    component.comment()
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['post', postExample.id])
  })

  it('editer() should redirect to edit post page', () => {
    spyOn(routerMock, 'navigate')
    component.editer()
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['edit', postExample.id])
  })

  it('should show an alert to confir deletion of a post and should show a confirmation messange', (fn) => {
    let id: number = 0;
    component.deletePost.subscribe(
      (count: number) => {

        id = count

        expect(swal.mixin).toHaveBeenCalled()
        expect(swal.fire).toHaveBeenCalled()
        expect(id).toEqual(postExample.id)
        fn()
      }
    )
    spyOn(swal, 'mixin').and.returnValue(swal);
    spyOn(swal, 'fire').and.resolveTo({ isConfirmed: true } as SweetAlertResult);
    component.delete()
  })

  it('should show an alert if a deletiion error is created', fakeAsync(() => {
    //postServiceMock=jasmine.createSpyObj('PostService',{getPost:of(postExample),like:of('like'),dislike:throwError(new Error('Test error')),deletePost:of({})})
    postServiceMock.deletePost.and.returnValue(throwError(() => new Error('Test error')));

    spyOn(swal, 'mixin').and.returnValue(swal);
    spyOn(swal, 'fire').and.resolveTo({ isConfirmed: true } as SweetAlertResult);
    fixture.detectChanges()
    component.delete()
    tick(1000)
    expect(swal.mixin).toHaveBeenCalled()
    expect(swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: jasmine.any(String),
        text: jasmine.any(String)
      }))
  }))

  it('should swho an alert if a dislike has a server error', fakeAsync(() => {
    postServiceMock.dislike.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(swal, 'fire');
    component.liked.set(true)
    component.likeHandler()
    expect(swal.fire).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      icon: 'error',
      title: jasmine.any(String),
      text: jasmine.any(String)
    })
    )
  }))

  it('should swho an alert if a like has a server error', fakeAsync(() => {

    postServiceMock.like.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(swal, 'fire');
    component.liked.set(false)

    component.likeHandler()
    expect(swal.fire).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        icon: 'error',
        title: jasmine.any(String),
        text: jasmine.any(String)
      })
    )
  }))

  it('should show the post title', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const title = debugElement.query(By.css('[data-testid="title"]'))
    expect(title.nativeElement.textContent.trim()).toEqual(postExample.title)
  })

  it('should generate a url for the image', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const url = debugElement.query(By.css('[data-testid="image"]'))
    expect(url?.attributes['src']).toEqual(component.url)
  })

  it('should show author name', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const author = debugElement.query(By.css('[data-testid="authorName"]'))
    expect(author.nativeElement.textContent).toEqual(postExample.author_name)
  })


  it('should show team name', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const team = debugElement.query(By.css('[data-testid="teamName"]'))
    expect(team.nativeElement.textContent.trim()).toEqual(postExample.team_name)
  })


  it('should dont show more button', fakeAsync(() => {
    postExample.content = 'short content'
    component.ngOnChanges({})
    fixture.detectChanges();
    tick(200)
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="showMore"]'))
    expect(button).toBeNull()
  }))

  it('should dont show more button with detail', fakeAsync(() => {
    component.detail = true
    component.ngOnChanges({})
    fixture.detectChanges();
    tick(200)
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="showMore"]'))
    expect(button).toBeNull()
  }))

  it('should change like flag pressin the button', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="likeOpener"]'))
    expect(component.isOpenLikes).toBe(false)
    button.triggerEventHandler('click', {})
    expect(component.isOpenLikes).toBe(true)
  })

  it('no show the likeOpener if likes is 0', () => {
    component.likes.set(0)
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="likeOpener"]'))
    expect(button).toBeNull()
  })

  it('show number of likes', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="likesNumber"]'))
    expect(button.nativeElement.textContent).toEqual(postExample.likes.toString())
  })
  it('show comment button if not detail', () => {
    component.detail = false
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="toComment"]'))
    expect(button).toBeTruthy()

  })
  it('no show comment button if detail', () => {
    component.detail = true
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="toComment"]'))
    expect(button).toBeNull()
  })

  it('clicking on comment button should call comment()', () => {
    component.detail = false
    fixture.detectChanges()
    spyOn(component, 'comment')
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="toComment"]'))
    button.triggerEventHandler('click', {})
    expect(component.comment).toHaveBeenCalled()
  })

  it('show number of comments', () => {
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const comments = debugElement.query(By.css('[data-testid="comments"]'))
    expect(comments.nativeElement.textContent.trim()).toEqual(postExample.comments.toString())
  })

  it(' show the liked buttom if liked', () => {
    postExample.liked = true
    component.ngOnChanges({})
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const comments = debugElement.query(By.css('[data-testid="LikeImg2"]'))
    expect(comments.nativeElement.src).toEqual('http://localhost:9876/assets/icons/liked.svg')
  })

  it(' show the liked buttom if liked', () => {
    postExample.liked = false
    component.ngOnChanges({})
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const comments = debugElement.query(By.css('[data-testid="LikeImg"]'))
    expect(comments.nativeElement.src).toEqual('http://localhost:9876/assets/icons/noliked.svg')
  })

  it('clicking on like button should call likeHandler()', () => {
    component.detail = false
    fixture.detectChanges()
    spyOn(component, 'likeHandler')
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const button = debugElement.query(By.css('[data-testid="LikeButton2"]'))
    button.triggerEventHandler('click', {})
    expect(component.likeHandler).toHaveBeenCalled()
  })


  it('show bottoms if edit', () => {
    postExample.edit = true
    component.ngOnChanges({})
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const buttonEdit = debugElement.query(By.css('[data-testid="editButton"]'))
    const buttonDelete = debugElement.query(By.css('[data-testid="deleteButton"]'))
    expect(buttonDelete).toBeTruthy()
    expect(buttonEdit).toBeTruthy()

  })

  it('editer() if click on edit button', () => {
    postExample.edit = true
    component.ngOnChanges({})
    fixture.detectChanges()
    spyOn(component, 'editer')
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const buttonEdit = debugElement.query(By.css('[data-testid="editButton"]'))
    buttonEdit.triggerEventHandler('click', {})
    expect(component.editer).toHaveBeenCalled()

  })
  it('delete() if click on delete button', () => {
    postExample.edit = true
    component.ngOnChanges({})
    fixture.detectChanges()
    spyOn(component, 'delete')
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const buttonEdit = debugElement.query(By.css('[data-testid="deleteButton"]'))
    buttonEdit.triggerEventHandler('click', {})
    expect(component.delete).toHaveBeenCalled()

  })



  it('no show bottoms if no edit', () => {
    postExample.edit = false
    component.ngOnChanges({})
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const buttonEdit = debugElement.query(By.css('[data-testid="editButton"]'))
    const buttonDelete = debugElement.query(By.css('[data-testid="deleteButton"]'))
    expect(buttonDelete).toBeNull()
    expect(buttonEdit).toBeNull()
  })

  it('no show like or comment bottoms if no user', () => {
    component.user = undefined
    fixture.detectChanges()
    const { debugElement } = fixture
    const { nativeElement } = debugElement
    const buttonLike = debugElement.query(By.css('[data-testid="LikeButton2'))
    const buttonComment = debugElement.query(By.css('[data-testid="newCommentButton"]'))
    expect(buttonComment).toBeNull()
    expect(buttonLike).toBeNull()
  })




});
