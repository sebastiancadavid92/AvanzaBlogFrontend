import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { category, permission } from '../../models/permissioncategory';
import { PermissioncategoryService } from '../../../services/permissioncategory/permissioncategory.service';
import { PostService } from '../../../services/post/post.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { Location } from '@angular/common';
import { newPost } from '../../models/post';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule,QuillModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit, OnChanges{
  newPostForm?:FormGroup;
  categories!:[category];
  permissions!:[permission];
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
  
  @Input({required:true}) postUpLoadData!: newPost|undefined;
  @Output() validData=new EventEmitter();
  @Input() postId:number|null=null;

  constructor(private categoryPermissionService:PermissioncategoryService, 
              private fb:FormBuilder,
              private location:Location,
              private router:Router){

              }


ngOnChanges(changes: SimpleChanges): void {
    if(!this.postUpLoadData){
      return
    }
    this.newPostForm=this.fb.group({
      title: new FormControl(this.postUpLoadData.title, [Validators.required]),
      content: new FormControl(this.postUpLoadData.html),
      categoriSelector:this.fb.array([])
                })

    
}

ngOnInit(): void {
  this.categoryPermissionService.permissions().subscribe({next:(result)=>{
    this.permissions=result

  },
  error:(error)=>{
    console.log(error)
    Swal.fire({
      
      icon: "error",
      title: "Oops...",
      text: error.status==0? "The API is not resonding" :JSON.stringify(error),
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
      text: error.status==0? "The API is not resonding" :JSON.stringify(error),
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
     permission:[this.postUpLoadData?.permission.PUBLIC, Validators.required],
   })
   this.categoriSelector.push(categoryPermissionForm);
   }
   else if(this.categories[i].categoryname=='AUTHENTICATED'){
     const categoryPermissionForm  = this.fb.group({
       permission:[this.postUpLoadData?.permission.AUTHENTICATED, Validators.required],
     })
     this.categoriSelector.push(categoryPermissionForm);
   }

   else if(this.categories[i].categoryname=='TEAM'){
     const categoryPermissionForm = this.fb.group({
       permission:[this.postUpLoadData?.permission.TEAM, Validators.required],
     })
     this.categoriSelector.push(categoryPermissionForm);
   }

   else if(this.categories[i].categoryname=='AUTHOR'){
     const categoryPermissionForm = this.fb.group({
       permission:[this.postUpLoadData?.permission.AUTHOR, Validators.required],
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

  if(this.newPostForm?.invalid){
    this.invalidform=true
    this.newPostForm.markAllAsTouched()
    return
  }
  this.invalidform=false

  const postData:newPost={
    title:this.title.value,
    content:this.quilleditor?.quillEditor.getText(),
    html:this.content.value,
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

  this.validData.emit(postData)

// aqui se envia la data para que la usen las paginas


}




}
