import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpostlistComponent } from './bpostlist.component';
import { Mock, MockComponent, MockProvider } from 'ng-mocks';

import { PostService } from '../../../services/post/post.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BpostlistComponent', () => {
  let component: BpostlistComponent;
  let fixture: ComponentFixture<BpostlistComponent>;
  let postServiceMock:jasmine.SpyObj<PostService>;
  let mockResult:any;
  
  beforeEach(async () => {

mockResult = {
    current: 1,  // Page number, assuming pagination
    count: 50,   // Total number of items
    results: [
      
      { id: 1, title: 'post 1' },
      { id: 2, title: 'post 2' },
      { id: 3, title: 'post 3' },
      { id: 4, title: 'post 4' },
      { id: 5, title: 'post 5' },
      { id: 6, title: 'post 6' },
      { id: 7, title: 'post 7' },
      { id: 8, title: 'post 8' },
      { id: 9, title: 'post 9' },
      { id: 10, title: 'post 10' }
    ],
    previous: 'previousPageUrl',  
    next: 'nextPageUrl'           
  };
    postServiceMock=jasmine.createSpyObj('PostService',{ listPostPage:of(mockResult),
      listPost:of(mockResult)})
    await TestBed.configureTestingModule({
      imports: [BpostlistComponent],
      providers:[MockProvider(PostService,postServiceMock),]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpostlistComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect load the post list', () => {
    
    fixture.detectChanges()
    expect(postServiceMock.listPost).toHaveBeenCalled()
    expect(component.bPostList).toEqual(mockResult.results)
    expect(component.initItem()).toEqual(((mockResult.current-1)*10)+1)
    expect(component.finalItem()).toEqual(((mockResult.current-1)*10)+mockResult.results.length)
    expect(component.totalItem()).toEqual(mockResult.count)
    expect(component.nextPage()).toEqual(mockResult.next)
    expect(component.previousPage()).toEqual(mockResult.previous)
  });

  it('expect to the post list be undefined when no post to show', () => {
    mockResult.count=0;
    component.ngOnInit()
    fixture.detectChanges()
    expect(component.bPostList).toBe(undefined)
  });

  it('expect to the post list be undefined when no post to show', () => {
    postServiceMock.listPost.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(Swal,'fire')
    
    component.ngOnInit()
    fixture.detectChanges()
   
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
      title:'Error',
      icon:'error',
      text:'We couldnt stablish conection to the server , try again later'
    }))
  });

  it('expect to render 10 posts', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    const posts=debugElement.queryAll(By.css('app-bpost'))
    expect(posts.length).toEqual(10) 
  });

  it('expect all post with detail atribute in false', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    const posts=debugElement.queryAll(By.css('app-bpost'))
    for(let i=0 ; i<posts.length; i++){
    expect(posts[i].attributes['ng-reflect-detail']).toEqual('false') 
    }
    
  });

  it('expect to handler a deletePost event with postDelete()', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    spyOn(component,'postDelete')
    const posts=debugElement.query(By.css('app-bpost'))
    posts.triggerEventHandler('deletePost',{})  
    expect(component.postDelete).toHaveBeenCalled()
   
  });

  it('expect to create a paginator component with arguments', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    const paginator=debugElement.query(By.css('app-paginator'))
    expect(paginator).toBeTruthy()
    expect(paginator.attributes['ng-reflect-final-item']).toEqual(component.finalItem().toString())
    expect(paginator.attributes['ng-reflect-init-item']).toEqual(component.initItem().toString())
    expect(paginator.attributes['ng-reflect-next-page']).toEqual(component.nextPage())
    expect(paginator.attributes['ng-reflect-previous-page']).toEqual(component.previousPage())
    expect(paginator.attributes['ng-reflect-total-item']).toEqual(component.totalItem().toString())

  });

  it('expect to handler a next event from paginator', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    spyOn(component,'next')
    const paginator=debugElement.query(By.css('app-paginator'))
    paginator.triggerEventHandler('next',{})  
    expect(component.next).toHaveBeenCalled()
  });

  it('expect to handler a next event calling postService', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    const paginator=debugElement.query(By.css('app-paginator'))
    paginator.triggerEventHandler('next',{})  
    expect(postServiceMock.listPostPage).toHaveBeenCalledWith(component.nextPage())
  });



 it('expect to handler a back event from paginator', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    spyOn(component,'back')
    const paginator=debugElement.query(By.css('app-paginator'))
    paginator.triggerEventHandler('back',{})  
    expect(component.back).toHaveBeenCalled()
  });

  it('expect to handler a back event calling postService', () => {
    const {debugElement}=fixture;
    const {nativeElement}=debugElement;
    const paginator=debugElement.query(By.css('app-paginator'))
    paginator.triggerEventHandler('back',{})  
    expect(postServiceMock.listPostPage).toHaveBeenCalledWith(component.previousPage())
  });


});
