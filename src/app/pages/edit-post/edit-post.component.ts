import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLinkActive } from '@angular/router';
import { PostFormComponent } from '../../shared/Component/post-form/post-form.component';
import { PostService } from '../../services/post/post.service';
import { Post, newPost } from '../../shared/models/post';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [PostFormComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit{
  id:number|null=null;
  postDetail:newPost|undefined=undefined;




  constructor(private router:Router, private routherParam:ActivatedRoute, private postService:PostService){}


  ngOnInit(): void {
    this.routherParam.paramMap.subscribe(params=>{
      this.id=Number(params.get('id'));
      this.postService.getPost(this.id).subscribe((result:any)=>{
        this.postDetail=result
        console.log(this.postDetail)
      })
    })

    
  }

  editPost(event:any){
    this.postService.updatePost(event,this.id).subscribe({
      next:()=>{
        console.log('updated!')
        console.log(this.id)
        this.router.navigate([`post/${this.id}`])
        

      },
      error:(error)=>{
        console.log(error)
      }
    })


  }

  
  }

