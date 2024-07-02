import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import{ MockProvider, MockComponent} from 'ng-mocks'
import { BpostComponent } from './bpost.component';
import { PostService } from '../../../services/post/post.service';
import { AuthService } from '../../../services/auth/auth.service';
import {of, throwError} from 'rxjs'
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { Post } from '../../models/post';
import Swal, { SweetAlertResult } from 'sweetalert2';
import swal from 'sweetalert2';
import { By } from '@angular/platform-browser';

describe('BpostComponent', () => {
  let component: BpostComponent;
  let postServiceMock:jasmine.SpyObj<PostService>;
  let authServiceMock:jasmine.SpyObj<AuthService>
  let routerMock:jasmine.SpyObj<Router>
  let fixture: ComponentFixture<BpostComponent>;
  let ActiverouterMock:jasmine.SpyObj<ActivatedRoute>
  const postExample: Post = {
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


    let userTest={
      id:1,
      username:'testUserName',
      teamName:'testTeam',
      teamId:1
    }

  beforeEach(async () => {
    postServiceMock=jasmine.createSpyObj('PostService',{
      getPost:of(postExample),
      like:of('like'),
      dislike:of('dislike'),
      deletePost:of({})
    })
    authServiceMock=jasmine.createSpyObj('AuthService',{getUser:undefined,wathcUser:of(userTest),saveUser:undefined})
    ActiverouterMock=jasmine.createSpyObj('ActivatedRoute',{outlet:undefined})
    await TestBed.configureTestingModule({
      imports: [BpostComponent],
      declarations:[],
      providers:[
        provideRouter([]),
        MockProvider(PostService,postServiceMock),
        MockProvider(AuthService,authServiceMock)
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpostComponent);
    routerMock=TestBed.inject(Router) as jasmine.SpyObj<Router>
    component = fixture.componentInstance;
    authServiceMock.getUser.and.returnValue(userTest);

    component.bPost=postExample;
    component.ngOnChanges({})
    fixture.detectChanges();
    
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user from the Authservice',()=>{
    expect(authServiceMock.getUser).toHaveBeenCalled()
    expect(component.user).toEqual(userTest)
    expect(component.url).toBeTruthy()
  })

  it('should load the data into the componnet variables',()=>{
    expect(component.edit).toEqual(postExample.edit)
    expect(component.content).toEqual(postExample.content)
    expect(component.liked()).toEqual(postExample.liked)
    expect(component.excerpt).toEqual(postExample.excerpt)
    expect(component.likes()).toEqual(postExample.likes)
    expect(component.html).toEqual(postExample.html)
    expect(component.id).toEqual(postExample.id)
  })

  it('should handle a dislike',()=>{
    component.likeHandler()
    expect(component.liked()).toEqual(false)
    expect(component.likes()).toEqual(postExample.likes-1)
  })

  it ('should handle a like ',()=>{
    component.liked.set(false)
    component.likeHandler()
    expect(component.liked()).toEqual(true)
    expect(component.likes()).toEqual(postExample.likes+1)
  })

  it('should redirect if click on the comment button',()=>{
    spyOn(routerMock,'navigate')
    component.comment()
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['post',postExample.id])
  })

  it('should redirect if click on the edit button',()=>{
    spyOn(routerMock,'navigate')
    component.editer()
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['edit',postExample.id])
  })

  it('should show an alert to confir deletion of a post and should show a confirmation messange',(fn)=>{
    let id:number=0;
    component.deletePost.subscribe(
      (count:number)=>{

        id=count    

    expect(swal.mixin).toHaveBeenCalled()
    expect(swal.fire).toHaveBeenCalled()
    expect(id).toEqual(postExample.id)
    fn()
      }
    )
    spyOn(swal, 'mixin').and.returnValue(swal);
    spyOn(swal, 'fire').and.resolveTo({isConfirmed: true} as SweetAlertResult);
    component.delete()
  })

  it('should show an alert if a deletiion error is created',fakeAsync(()=>{
    //postServiceMock=jasmine.createSpyObj('PostService',{getPost:of(postExample),like:of('like'),dislike:throwError(new Error('Test error')),deletePost:of({})})
    postServiceMock.deletePost.and.returnValue(throwError(() => new Error('Test error')));
  
    spyOn(swal, 'mixin').and.returnValue(swal);
    spyOn(swal, 'fire').and.resolveTo({isConfirmed:true} as SweetAlertResult);
    fixture.detectChanges()

    component.delete()
    tick(1000)

    expect(swal.mixin).toHaveBeenCalled()
    expect(swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: jasmine.any(String),
        text: jasmine.any(String)}))
  }))

  it('should swho an alert if a dislike has a server error',fakeAsync(()=>{

    postServiceMock.dislike.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(swal, 'fire');
    component.liked.set(true)

    component.likeHandler()
    expect(swal.fire).toHaveBeenCalledOnceWith(      jasmine.objectContaining({
      icon: 'error',
      title: jasmine.any(String),
      text: jasmine.any(String)})
    )
  }))

  it('should swho an alert if a like has a server error',fakeAsync(()=>{

    postServiceMock.like.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(swal, 'fire');
    component.liked.set(false)

    component.likeHandler()
    expect(swal.fire).toHaveBeenCalledOnceWith(      
      jasmine.objectContaining({
      icon: 'error',
      title: jasmine.any(String),
      text: jasmine.any(String)})
    )
  }))

  it('should show the post title',()=>{
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const title=debugElement.query(By.css('[data-testid="title"]'))
    expect(title.nativeElement.textContent.trim()).toEqual(postExample.title)
  })

  it('should generate a url for the image',()=>{
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const url=debugElement.query(By.css('[data-testid="image"]'))
    expect(url?.attributes['src']).toEqual(component.url)
  })

  it('should show author name',()=>{
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const author=debugElement.query(By.css('[data-testid="authorName"]'))
    expect(author.nativeElement.textContent).toEqual(postExample.author_name)
  })


  it('should show team name',()=>{
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const team=debugElement.query(By.css('[data-testid="teamName"]'))
    expect(team.nativeElement.textContent.trim()).toEqual(postExample.team_name)
  })

/*   it('should show more button in blog list',fakeAsync(()=>{
    component.detail=false
    fixture.detectChanges()
    tick(1000)
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const button=debugElement.query(By.css('[data-testid="showMore"]'))
    tick(1000)
    expect(button.nativeElement.textContent.trim()).toEqual('show more..')
  })) */

  it('should dont show more button',fakeAsync(()=>{
    postExample.content='short content'
    component.ngOnChanges({})
    fixture.detectChanges();
    tick(200)
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const button=debugElement.query(By.css('[data-testid="showMore"]'))
    expect(button).toBeNull()
  }))
  
  it('should dont show more button with detail',fakeAsync(()=>{
    component.detail=true
    component.ngOnChanges({})
    fixture.detectChanges();
    tick(200)
    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const button=debugElement.query(By.css('[data-testid="showMore"]'))
    expect(button).toBeNull()
  }))

  it('should change like flag pressin the button',()=>{

    const {debugElement}=fixture
    const {nativeElement}=debugElement
    const button=debugElement.query(By.css('[data-testid="likeOpener"]'))
    expect(component.isOpenLikes).toBe(false)
    button.triggerEventHandler('click',{})
    expect(component.isOpenLikes).toBe(true)
   
  })





});
