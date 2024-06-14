import { Component,Input, OnInit, signal } from '@angular/core';
import {userList} from '../../models/user'
import { LikeService } from '../../../services/like/like.service';
import { CommentService } from '../../../services/comment/comment.service';
import { PaginatorComponent } from '../paginator/paginator.component';
@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [PaginatorComponent],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit {
  @Input({required:true}) likes?:boolean;
  @Input({required:true}) postId?:number;
  users?:[userList];
 
  initItem= signal(3)
  finalItem=signal(5)
  totalItem=signal(8)
  previousPage=signal('')
  nextPage=signal('')
 
  observer={next:(result:any)=>{
   this.initItem.set(((result.current-1)*15)+1)
   this.totalItem.set(result.count)
   this.finalItem.set(((result.current-1)*15)+result.results.length)
   this.previousPage.set(result.previous)
   this.nextPage.set(result.next)
   this.users=result.results 

 },
 error:(err:any)=>{
   alert('err')
 }
 
 }
 



  constructor(private likeService:LikeService,private commentService:CommentService){
  }


  ngOnInit(): void {
    if (this.likes===true){
      this.likeService.listLikes(this.postId??0).subscribe( this.observer
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

  back(){
    this.likeService.listLikePage(this.previousPage()).subscribe(this.observer)
   }
  
   next(){
    this.likeService.listLikePage(this.nextPage()).subscribe(this.observer)
   }
    
  
  
  






}
