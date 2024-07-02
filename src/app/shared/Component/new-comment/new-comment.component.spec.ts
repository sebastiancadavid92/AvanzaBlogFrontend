import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentComponent } from './new-comment.component';
import { PostService } from '../../../services/post/post.service';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { AnimationDriver } from '@angular/animations/browser';

describe('NewCommentComponent', () => {
  let component: NewCommentComponent;
  let fixture: ComponentFixture<NewCommentComponent>;
  let postServiceMock:jasmine.SpyObj<PostService>

  beforeEach(async () => {
    postServiceMock = jasmine.createSpyObj('PostService', {
      commentPost: of('comment post'),

    })
    await TestBed.configureTestingModule({
      imports: [NewCommentComponent],
      providers:[MockProvider(PostService,postServiceMock)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark invalid if textarea is empty and submit is clicked', () => {
    component.submit();
    fixture.detectChanges();
    
    expect(component.invalid).toBeTrue();
    const errorMessage = fixture.nativeElement.querySelector('p');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Empty comments are not allowed');
  });

/*   it('should call commentPost on PostService when submit is clicked and form is valid', () => {
    component.commentContent.setValue('This is a test comment');
    postServiceMock.commentPost.and.returnValue(of({}));
    
    component.submit();
    
    expect(postServiceMock.commentPost).toHaveBeenCalledWith(component.postId, { content: 'This is a test comment' });
  }); */

  it('should reset the form when cancel is clicked', () => {
    component.commentContent.setValue('This is a test comment');
    
    component.cancel(new Event('cancel'));
    
    expect(component.commentContent.value).toBeNull();
  });

/*   it('should reload the window on successful comment submission', () => {
    spyOn(component, 'reloadPage')
    component.commentContent.setValue('This is a test comment');
    postServiceMock.commentPost.and.returnValue(of({}));
    component.submit();
    fixture.detectChanges()
    expect(component.reloadPage).toHaveBeenCalled();
  }); */




});
