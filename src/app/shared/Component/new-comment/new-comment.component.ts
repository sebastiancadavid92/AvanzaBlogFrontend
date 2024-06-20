import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommentService } from '../../../services/comment/comment.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post/post.service';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-comment.component.html',
  styleUrl: './new-comment.component.css'
})
export class NewCommentComponent implements OnChanges{

  @Input({required:true}) postId:number|undefined

  commentContent=new FormControl<string>('',[Validators.required])

  constructor(private postService:PostService){}


  ngOnChanges(changes: SimpleChanges): void {
  
  }


  cancel(event:Event){
    
    this.commentContent.reset()

  }

  submit(){
    if (this.commentContent.valid){
      this.postService.commentPost(this.postId,{content:this.commentContent.value})?.subscribe({
        next:()=>{
          window.location.reload()
        }
      })
       
    }
    else{
      this.commentContent.markAsTouched({onlySelf:true})
    }
   
  
  }
}
