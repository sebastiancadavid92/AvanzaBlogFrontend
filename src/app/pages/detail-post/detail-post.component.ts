import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../shared/models/post';
import Swal from 'sweetalert2';
import { BpostComponent } from '../../shared/Component/bpost/bpost.component';
import { CommentListComponent } from '../../shared/Component/comment-list/comment-list.component';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [BpostComponent,CommentListComponent],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.css'
})
export class DetailPostComponent implements OnInit{
  id:number|null=null;
  bPost?:Post;

  constructor(private route:ActivatedRoute, private postService:PostService){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      this.id=Number(params.get('id'));
      this.postService.getPost(this.id).subscribe({next:(result:any)=>{
      
        this.bPost=result

      },
      error:(error)=>{
        Swal.fire(


        )

      }

    })
    })
  }
  

}
