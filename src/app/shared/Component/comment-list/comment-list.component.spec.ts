import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentListComponent } from './comment-list.component';
import { CommentComponent } from '../comment/comment.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommentService } from '../../../services/comment/comment.service';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Router, provideRouter } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockProvider } from 'ng-mocks';
import { Comment } from '../../models/post';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;
  let commentServiceMock: jasmine.SpyObj<CommentService>;
  let routerMock: jasmine.SpyObj<Router>

  

  const responseMok={
    current: 1,
    count: 10,
    results: [

      { id: 1, username: 'User1', timestamp: '2023-06-01', content: 'Comment 1', delete: true },
      { id: 2, username: 'User2', timestamp: '2023-06-02', content: 'Comment 2', delete: false }
    ],
    previous: 'previousPageUlr',
    next: 'nextPageUrl'
  }


  beforeEach(async () => {
    commentServiceMock = jasmine.createSpyObj('commentService', {
      listCommentsPage : of(responseMok),
      listComments: of(responseMok),
      deleteComment: of({})
    })

    await TestBed.configureTestingModule({
      imports: [CommentListComponent],
      providers: [
        provideRouter([]),
        MockProvider(CommentService,commentServiceMock),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>
    component = fixture.componentInstance;
    component.comments=false
    component.postId=1
    component.ngOnChanges({})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all the comments and paginator info', () => {
    component.ngOnChanges({})
    fixture.detectChanges()
    
    expect(component.initItem()).toEqual(((responseMok.current-1)*5)+1)
    expect(component.totalItem()).toEqual(responseMok.count)
    expect(component.finalItem()).toEqual(((responseMok.current-1)*5)+responseMok.results.length)
    expect(component.previousPage()).toEqual(responseMok.previous)
    expect(component.nextPage()).toEqual(responseMok.next)
    expect(component.commentList).toEqual(responseMok.results as [Comment])
  });

/*   fit('it should handle errors from backend', () => {
    commentServiceMock.listComments.and.returnValue(throwError(() => new Error('Test error')))
    spyOn(routerMock,'navigate')
    spyOn(Swal,'fire').and.resolveTo({}as SweetAlertResult)
    component.ngOnChanges({})
    fixture.detectChanges()
    
    expect(routerMock.navigate).toHaveBeenCalled()
    expect(Swal.fire).toHaveBeenCalled() }); */
    
    it('should call next page function', () => {
      commentServiceMock.listCommentsPage.and.returnValue(of(responseMok));
      component.nextPage.set('nextPageUrl');
  
      component.next();
      fixture.detectChanges();
  
      expect(commentServiceMock.listCommentsPage).toHaveBeenCalledWith('nextPageUrl');
      expect(component.commentList).toEqual(responseMok.results as [Comment]);
    });
  
    it('should call previous page function', () => {
     component.previousPage.set('previousPageUrl');
  
      component.back();
      fixture.detectChanges();
  
      expect(commentServiceMock.listCommentsPage).toHaveBeenCalledWith('previousPageUrl');
      //expect(component.commentList).toEqual(responseMock.results);
    });
  
    it('should delete comment and refresh list', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
      commentServiceMock.deleteComment.and.returnValue(of({}));
      commentServiceMock.listComments.and.returnValue(of(responseMok));
  
      component.postId = 1;
      component.delete(1);
      fixture.detectChanges();
  
      expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(1, 1);
      expect(Swal.fire).toHaveBeenCalled();
      expect(commentServiceMock.listComments).toHaveBeenCalledWith(1);
    });

    it('should render paginator component when comments is true', () => {
      commentServiceMock.listComments.and.returnValue(of(responseMok));
      component.postId = 1;
      component.comments = true;
      component.ngOnChanges({});
      fixture.detectChanges();
  
      const paginatorElement = fixture.nativeElement.querySelector('app-paginator');
      expect(paginatorElement).toBeTruthy();
    });
  
    it('should not render paginator component when comments is false', () => {
      commentServiceMock.listComments.and.returnValue(of(responseMok));
      component.postId = 1;
      component.comments = false;
      component.ngOnChanges({});
      fixture.detectChanges();
  
      const paginatorElement = fixture.nativeElement.querySelector('app-paginator');
      expect(paginatorElement).toBeFalsy();
    });


  

  
});