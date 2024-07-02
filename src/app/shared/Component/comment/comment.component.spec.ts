import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment.component';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MatCardModule,CommentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the comment details', () => {
    const mockComment = {
      id: 1,
      username: 'John Doe',
      timestamp: '2023-06-01',
      content: 'This is a test comment',
      delete: true
    };

    component.comment = mockComment;
    fixture.detectChanges();

    const usernameElement = debugElement.query(By.css('.user-name')).nativeElement;
    const contentElement = debugElement.query(By.css('mat-card-content p')).nativeElement;
    expect(usernameElement.textContent).toContain(mockComment.username);
    expect(contentElement.textContent).toContain(mockComment.content);
  });

  it('should emit delete event when delete button is clicked', () => {
    const mockComment = {
      id: 1,
      username: 'John Doe',
      timestamp: '2023-06-01',
      content: 'This is a test comment',
      delete: true
    };

    component.comment = mockComment;
    spyOn(component.del, 'emit');

    fixture.detectChanges();

    const deleteButton = debugElement.query(By.css('button')).nativeElement;
    deleteButton.click();

    expect(component.del.emit).toHaveBeenCalledWith(mockComment.id);
  });

  it('should not display delete button if comment.delete is false', () => {
    const mockComment = {
      id: 1,
      username: 'John Doe',
      timestamp: '2023-06-01',
      content: 'This is a test comment',
      delete: false
    };

    component.comment = mockComment;
    fixture.detectChanges();

    const deleteButton = debugElement.query(By.css('button'));
    expect(deleteButton).toBeNull();
  });
});