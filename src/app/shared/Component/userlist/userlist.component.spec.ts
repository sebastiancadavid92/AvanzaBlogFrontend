import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistComponent } from './userlist.component';
import { LikeService } from '../../../services/like/like.service';
import { MockProvider } from 'ng-mocks';
import { userList } from '../../models/user';
import { of, throwError } from 'rxjs';

describe('UserlistComponent', () => {
  let component: UserlistComponent;
  let fixture: ComponentFixture<UserlistComponent>;
  let likeServiceMock:jasmine.SpyObj<LikeService>
  const mockUserList: userList[] = [
    { username: 'user1' },
    { username: 'user2' },
  ];

  const responseMock = {
    current: 1,
    count: 2,
    results: mockUserList,
    previous: 'previousPageUrl',
    next: 'nextPageUrl',
  };

  beforeEach(async () => {
   likeServiceMock = jasmine.createSpyObj('LikeService', ['listLikes', 'listLikePage']);



    await TestBed.configureTestingModule({
      imports: [UserlistComponent],
      providers:[MockProvider(LikeService,likeServiceMock)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize values correctly', () => {
    likeServiceMock.listLikes.and.returnValue(of(responseMock));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    expect(component.initItem()).toBe(1);
    expect(component.finalItem()).toBe(2);
    expect(component.totalItem()).toBe(2);
    expect(component.previousPage()).toBe('previousPageUrl');
    expect(component.nextPage()).toBe('nextPageUrl');
    expect(component.users).toEqual(mockUserList as [userList]);
  });

  it('should call listLikes on init if likes is true', () => {
    likeServiceMock.listLikes.and.returnValue(of(responseMock));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    expect(likeServiceMock.listLikes).toHaveBeenCalledWith(1);
  });

  it('should not call listLikes on init if likes is false', () => {
    component.likes = false;
    fixture.detectChanges();

    expect(likeServiceMock.listLikes).not.toHaveBeenCalled();
  });

  it('should render paginator component if users are present', () => {
    likeServiceMock.listLikes.and.returnValue(of(responseMock));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('app-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not render paginator component if no users are present', () => {
    likeServiceMock.listLikes.and.returnValue(of({ ...responseMock, count: 0 }));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('app-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should handle back pagination correctly', () => {
    likeServiceMock.listLikes.and.returnValue(of(responseMock));
    likeServiceMock.listLikePage.and.returnValue(of(responseMock));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    component.back();
    expect(likeServiceMock.listLikePage).toHaveBeenCalledWith('previousPageUrl');
  });

  it('should handle next pagination correctly', () => {
    likeServiceMock.listLikes.and.returnValue(of(responseMock));
    likeServiceMock.listLikePage.and.returnValue(of(responseMock));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit()
    fixture.detectChanges();

    component.next();
    expect(likeServiceMock.listLikePage).toHaveBeenCalledWith('nextPageUrl');
  });

  it('should handle errors correctly', () => {
    spyOn(window, 'alert');
    likeServiceMock.listLikes.and.returnValue(throwError(() => new Error('Test error')));
    component.likes = true;
    component.postId = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(window.alert).toHaveBeenCalledWith('err');
  });

  it('should generate correct random URLs', () => {
    const url = component.random();
    expect(url).toMatch(/https:\/\/picsum.photos\/id\/\d{2}\/50\/50\?random/);
  });



});
