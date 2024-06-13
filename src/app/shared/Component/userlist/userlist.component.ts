import { Component,Input, OnInit } from '@angular/core';
import {userList} from '../../models/user'
import { LikeService } from '../../../services/like/like.service';
import { CommentService } from '../../../services/comment/comment.service';
@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  @Input({required:true}) likes?:boolean;
  @Input({required:true}) postId?:number;
  users?:[userList];


  constructor(private likeService:LikeService,private commentService:CommentService){
  }


  ngOnInit(): void {
    if (this.likes===true){
      this.likeService.listLikes(this.postId??0).subscribe(
        {next:(result:any)=>{
          console.log(result.results)
          this.users=result.results
        
        },      
        error:(err:any)=>{
          console.log(err)
          alert(err)
  
        }
      }
      
      )

    }

    else if (this.likes===false){
      this.commentService.listComments(this.postId??0).subscribe(
        {next:(result:any)=>{
          console.log(result.results)
          this.users=result.results
        
        },
      error:(err:any)=>{
        console.log(err)
        alert(err)
      }}
      )

    }
    
  }

}
