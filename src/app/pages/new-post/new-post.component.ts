import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill'
import Swal from 'sweetalert2';
import { PermissioncategoryService } from '../../services/permissioncategory/permissioncategory.service';
import { category, permission } from '../../shared/models/permissioncategory';
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

  constructor(private categoryPermissionService:PermissioncategoryService, private fb:FormBuilder){
    this.newPostForm=this.fb.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl(''),
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
    const selectors = this.newPostForm!.get('categoriSelector') as FormArray;
    for(let i =0; i<numCategories; i++){
      selectors.push(this.fb.control('', Validators.required));
    }
  }

  publish(forma:FormGroupDirective){
    debugger
    console.log(this.content.hasError('minLengthError'))
    console.log(this.title.valid)
    console.log(this.quilleditor?.quillEditor.getSemanticHTML())
    console.log(this.quilleditor?.quillEditor.getText())
  }

}
