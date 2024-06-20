import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../shared/models/post';
import Swal from 'sweetalert2';
import { BpostComponent } from '../../shared/Component/bpost/bpost.component';
import { CommentListComponent } from '../../shared/Component/comment-list/comment-list.component';
import { NewCommentComponent } from '../../shared/Component/new-comment/new-comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { authUser } from '../../shared/models/user';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [BpostComponent,CommentListComponent,NewCommentComponent],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.css'
})
export class DetailPostComponent implements OnInit{
  id:number|null=null;
  bPost?:Post;
  user?:authUser;

  constructor(private route:ActivatedRoute, private postService:PostService,private router:Router, private authService:AuthService){
    

  }


  isCommentValid(){
    if (this.bPost?.comments===undefined){
      return false
    }
    if(this.bPost?.comments<=5){
      return false
    }
    else{
      return true
    }
  }

  ngOnInit(): void {

    this.user=this.authService.getUser()
    this.route.paramMap.subscribe(params=>{
      this.id=Number(params.get('id'));
      this.postService.getPost(this.id).subscribe({next:(result:any)=>{

      
        this.bPost=result

      },
      error:(error)=>{
        console.log(error)
        Swal.fire(
        {
          icon: "error",
          title: "Oops...",
          text: error.error.detail,
        }


        ).then((result)=>{
          this.router.navigate(['/'])
          
        })

      }

    })
    })
  }
  

}
