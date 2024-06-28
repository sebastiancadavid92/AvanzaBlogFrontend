import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLinkActive } from '@angular/router';
import { PostFormComponent } from '../../shared/Component/post-form/post-form.component';
import { PostService } from '../../services/post/post.service';
import { Post, newPost } from '../../shared/models/post';
import Swal from 'sweetalert2';

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
      this.postService.getPost(this.id).subscribe({next:(result:any)=>{
        if(result.edit){
          this.postDetail=result
        }
        else{
          this.postDetail=undefined
          Swal.fire({
          title:'Te post Cant be updated',
          icon:'error'
        }).then(()=>{
          this.router.navigate(['/'])
        })

        }
        
      },
    error:(err)=>{
      Swal.fire({
        title:'ooops',
        icon:'error',
        text:`an error has corrued: ${JSON.stringify(err)}`
      }).then(()=>{
        this.router.navigate(['/'])
      })


    }})
    })

    
  }

  editPost(event:any){
    this.postService.updatePost(event,this.id).subscribe({
      next:()=>{
        Swal.fire({
          title:'Te post has been updated',
          icon:'success'
        }).then(()=>{
          this.router.navigate([`post/${this.id}`])
        })
 
        
        

      },
      error:(error)=>{
        if(error.status==403){

          Swal.fire({
          title:'something went wrong',
          icon:'error'
        }).then(()=>{
          this.router.navigate(['/'])
        })
        
        }

      }
    })


  }

  
  }

