import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';

import { authUser } from '../../shared/models/user';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PostFormComponent } from '../../shared/Component/post-form/post-form.component';
import { newPost } from '../../shared/models/post';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [PostFormComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit{


  user!:authUser;
  postUpLoadData:newPost={
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

  


  constructor(
    private postService:PostService,
    private authService:AuthService,
    private routher:Router,
    ){

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
    
  }




newPost(data:any){

this.postService.newPost(data).subscribe({next:()=>{
      Swal.fire({
        text: "Post Created Succesfully",
        icon: "success",
        iconColor:"#00f0b7",
        showConfirmButton: false,
        timer: 800,
      }).then(
      ()=>{this.routher.navigate(['/'])}
      );


    },
    error:(error)=>{
    
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.status==0? "The API is not resonding" :JSON.stringify(error),        })
  

    }}) 

}


}
