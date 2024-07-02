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
  users?:[userList]|undefined;
 
  initItem= signal(3)
  finalItem=signal(5)
  totalItem=signal(8)
  previousPage=signal('')
  nextPage=signal('')
  url=''
  observer={next:(result:any)=>{
   
   this.initItem.set(((result.current-1)*15)+1)
   this.totalItem.set(result.count)
   this.finalItem.set(((result.current-1)*15)+result.results.length)
   this.previousPage.set(result.previous)
   this.nextPage.set(result.next)
   if(this.totalItem()==0){
    this.users=undefined
   }
   else{
  
       this.users=result.results 
   }



 },
 error:(err:any)=>{
   alert('err')
 }
 
 }
 
  constructor(private likeService:LikeService){
  }


  ngOnInit(): void {
    if (this.likes===true){
      this.likeService.listLikes(this.postId??0).subscribe( this.observer)

    }

   
  }

  back(){
    this.likeService.listLikePage(this.previousPage()).subscribe(this.observer)
   }
  
   next(){
    this.likeService.listLikePage(this.nextPage()).subscribe(this.observer)
   }
    
  
   random(){
    let num=Math.floor(Math.random() * 15) + 10
    return`https://picsum.photos/id/${num}/50/50?random`

  }
  






}
