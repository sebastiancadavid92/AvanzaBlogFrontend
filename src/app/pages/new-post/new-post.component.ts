import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill'
import Swal from 'sweetalert2';
import { PermissioncategoryService } from '../../services/permissioncategory/permissioncategory.service';
import { category, permission } from '../../shared/models/permissioncategory';
import { authUser } from '../../shared/models/user';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common'
import { newPost } from '../../shared/models/post';
import { PostService } from '../../services/post/post.service';
@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule,QuillModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit{
  newPostForm?:FormGroup;
  categories!:[category];
  permissions!:[permission];
  user!:authUser;


  invalidform=false;
  quillModule={
    toolbar : [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],             // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],

    ]
  }

  @ViewChild('quilleditor') quilleditor?: QuillEditorComponent;

  constructor(private categoryPermissionService:PermissioncategoryService, 
    private fb:FormBuilder,
    private authService:AuthService,
    private routher:Router,
    private location:Location,
    private postService:PostService,
    private router:Router){
    this.newPostForm=this.fb.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl(''),
      categoriSelector:this.fb.array([])
    })

  }
  
  ngOnInit(): void {
    this.user=this.authService.getUser()
    if (!this.user){
      Swal.fire({
        
        background:"white",
        icon: "error",
        title: "Access denied",
        text: "Only authenticated users are allowed to create new posts",
      }).then(()=> this.routher.navigate(['/']))

    }

    this.categoryPermissionService.permissions().subscribe({next:(result)=>{
      this.permissions=result

    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        
        icon: "error",
        title: "Oops...",
        text: JSON.stringify(error.error),
      })

    }
  })

    this.categoryPermissionService.categories().subscribe({next:(result)=>{
      this.categories=result
      this.initCategories(this.categories.length)

  
    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        
        icon: "error",
        title: "Oops...",
        text: JSON.stringify(error.error),
      })
    }
  })



    
  }

  get content()
  {return this.newPostForm?.get('content')!
  }

  get title()
  {
    return this.newPostForm?.get('title')!
  }

  get categoriSelector(){
    return this.newPostForm?.controls['categoriSelector'] as FormArray
  }

  initCategories(numCategories:number){

   for(let i =0; i<numCategories; i++){
    
    if(this.categories[i].categoryname=='PUBLIC'){
    const categoryPermissionForm = this.fb.group({
      permission:['READ_ONLY', Validators.required],
    })
    this.categoriSelector.push(categoryPermissionForm);
    }
    else if(this.categories[i].categoryname=='AUTHENTICATED'){
      const categoryPermissionForm = this.fb.group({
        permission:['READ_ONLY', Validators.required],
      })
      this.categoriSelector.push(categoryPermissionForm);
    }

    else if(this.categories[i].categoryname=='TEAM'){
      const categoryPermissionForm = this.fb.group({
        permission:['EDIT', Validators.required],
      })
      this.categoriSelector.push(categoryPermissionForm);
    }

    else if(this.categories[i].categoryname=='AUTHOR'){
      const categoryPermissionForm = this.fb.group({
        permission:['EDIT', Validators.required],
      })
      this.categoriSelector.push(categoryPermissionForm);
    }


    }
  }

  cancel(){
    this.location.back();
    return
  }

  publish(){
    //redireccionar al home pag
    if(this.newPostForm?.invalid){
      this.invalidform=true
      this.newPostForm.markAllAsTouched()
      return
    }
    this.invalidform=false

    const postData:newPost={
      title:this.title.value,
      content:this.quilleditor?.quillEditor.getText(),
      html:this.quilleditor?.quillEditor.getSemanticHTML(),
      permission:{
        AUTHENTICATED:'',
        TEAM:'',
        AUTHOR:'',
        PUBLIC:''
      }
    }

    for(let i=0;i<this.categories.length;i++){
      if (this.categories[i].categoryname=='AUTHENTICATED'){
        postData.permission.AUTHENTICATED=this.categoriSelector.controls[i].value.permission
      
      }
      else if (this.categories[i].categoryname=='TEAM'){
        postData.permission.TEAM=this.categoriSelector.controls[i].value.permission
      }
      else if (this.categories[i].categoryname=='AUTHOR'){
        postData.permission.AUTHOR=this.categoriSelector.controls[i].value.permission
  
      }
      else if (this.categories[i].categoryname=='PUBLIC'){
        postData.permission.PUBLIC=this.categoriSelector.controls[i].value.permission

      }
    }



    this.postService.newPost(postData).subscribe({next:()=>{
      Swal.fire({
        text: "logout successful",
        icon: "success",
        iconColor:"#00f0b7",
        showConfirmButton: false,
        timer: 800,
      }).then(
      ()=>{this.router.navigate(['/'])}
      );


    },
    error:(error)=>{
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.stringify(error.error),
      })
    }})

    





  }

}
