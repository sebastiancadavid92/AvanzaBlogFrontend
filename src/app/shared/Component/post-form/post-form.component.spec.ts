import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostFormComponent } from './post-form.component';
import { PermissioncategoryService } from '../../../services/permissioncategory/permissioncategory.service';
import { Router, provideRouter } from '@angular/router';
import { MockComponent, MockProvider } from 'ng-mocks';
import { Subject, of, throwError } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { category, permission } from '../../models/permissioncategory';
import { newPost } from '../../models/post';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AbstractControl, FormArray } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;
  let categoryServiceMock:jasmine.SpyObj<PermissioncategoryService>
  let routerMock:jasmine.SpyObj<Router>
  let obsPerms: Subject<[permission]>
  let obsCate: Subject<[category]>
  let locationMock:jasmine.SpyObj<Location>

  let newPostData:newPost

  const permissions= [
    { id: 1, permissionname: 'READ_ONLY', verboseName: 'Read Only' },
    { id: 2, permissionname: 'EDIT', verboseName: 'Edit' },
    { id: 3, permissionname: 'NONE', verboseName: 'None' },
  ];
  
  const categories= [
    { id: 1, categoryname: 'PUBLIC', verboseName: 'Public' },
    { id: 2, categoryname: 'AUTHOR', verboseName: 'Author' },
    { id: 3, categoryname: 'TEAM', verboseName: 'Team' },
    { id: 4, categoryname: 'AUTHENTICATED', verboseName: 'Authenticated' }
  ];

  const updatePostData: newPost = {
    title: "Sample Post Title",
    content: "This is the content of the sample post.",
    html: "<p>This is the HTML content of the sample post.</p>",
    permission: {
      PUBLIC: "READ_ONLY",
      AUTHOR: "EDIT",
      TEAM: "NONE",
      AUTHENTICATED: "READ_ONLY"
    }
  };


  
  beforeEach(async () => {


  newPostData={
    title:'',
    content:'',
    html:'',
    permission: {
      PUBLIC: 'READ_ONLY',
      AUTHOR:"EDIT",
      TEAM:"EDIT",
      AUTHENTICATED:"READ_ONLY"
  }
  }

    obsPerms=new Subject<[permission]>();
    obsCate=new Subject<[category]>();

    categoryServiceMock=jasmine.createSpyObj('PermissioncategoryService',{
      permissions:obsPerms, 
      categories:obsCate
    })

    locationMock=jasmine.createSpyObj('Location',['back'])


    await TestBed.configureTestingModule({
    imports: [PostFormComponent,QuillEditorComponent],
    declarations:[],  
    providers:[
        provideRouter([]),
        MockProvider(PermissioncategoryService,categoryServiceMock),
        MockProvider(Location,locationMock),
        provideAnimations()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostFormComponent);
    routerMock=TestBed.inject(Router) as jasmine.SpyObj<Router>
    component = fixture.componentInstance;
    component.postUpLoadData=newPostData;
    component.ngOnChanges({})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create de form Group and categories shouldnt be created', () => {
    expect(component.newPostForm).toBeTruthy();
    expect(component.categoriSelector.length).toBe(0)
  });

  it('should load categories and permissions correctly', fakeAsync(() => {
    obsPerms.next(permissions as  [permission])
    obsCate.next(categories as  [category])
    expect(component.categoriSelector.length).toBe(4)
    expect(component.categoriSelector.value[0].permission).toEqual(newPostData.permission.PUBLIC)
    expect(component.categoriSelector.value[1].permission).toEqual(newPostData.permission.AUTHOR)
    expect(component.categoriSelector.value[2].permission).toEqual(newPostData.permission.TEAM)
    expect(component.categoriSelector.value[3].permission).toEqual(newPostData.permission.AUTHENTICATED)
  }));

  it('permission subscription should handle errors correctly', fakeAsync(() => {
    categoryServiceMock.permissions.and.returnValue(throwError(()=>{'Error Test'}))
    spyOn(Swal,'fire')
    component.ngOnInit()
    fixture.detectChanges()
    tick(1000)
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: "Oops...",
      })
    )
    expect(component.categoriSelector.length).toBe(0)
     }));

     it('category subscription should handle errors correctly', fakeAsync(() => {
      categoryServiceMock.categories.and.returnValue(throwError(()=>{'Error Test'}))
      spyOn(Swal,'fire')
      component.ngOnInit()
      fixture.detectChanges()
      tick(1000)
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: "Oops...",
        })
      )
      expect(component.categoriSelector.length).toBe(0)
       }));

      it('should call back page if cancel is called', () => {
        component.cancel()
        expect(locationMock.back).toHaveBeenCalled()
      });
    
      it('should return content from control', () => {
        let cont=component.content
        expect(cont).toBe(component.newPostForm.get('content')as AbstractControl);
     
      });

      it('should return title from control', () => {
        let title=component.title
        expect(title).toBe(component.newPostForm.get('title')as AbstractControl);
     
      });

      it('titlle should be invalid if empty', () => {
        component.title.setValue('')
       expect(component.title.valid).toBeFalse()   
      });


      it('content should be valid if html has 5 or more chars not including html tags', () => {
        newPostData.html='<h1>123</h1>'
        newPostData.title='this is a valid title'
        component.postUpLoadData=newPostData;
        component.ngOnChanges({})
        fixture.detectChanges()
       expect(component.newPostForm.valid).toBeTrue()   
      });

      it('should turn invalid flag on true', () => {
        component.publish()
        fixture.detectChanges()
        expect(component.invalidform).toBeTrue()


      });

/*       fit('should create a valid post', fakeAsync(() => {
        component.postUpLoadData=updatePostData
        component.ngOnInit()
        component.ngOnChanges({})
        component.publish()
        fixture.detectChanges()
        tick();
        flush();
        expect().toBeTrue()
      }));
 */

    


});
