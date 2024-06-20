import { Component, Input, OnChanges, OnInit, SimpleChanges, signal } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { CommentService } from '../../../services/comment/comment.service';
import { Comment } from '../../models/post';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommentComponent,PaginatorComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit,OnChanges{
  @Input({required:true}) postId:number|undefined;
  @Input({required:true}) comments:boolean|undefined;
  commentList?:[Comment];

  initItem= signal(0)
  finalItem=signal(0)
  totalItem=signal(0)
  previousPage=signal('')
  nextPage=signal('')
 
  observer={next:(result:any)=>{
   this.initItem.set(((result.current-1)*5)+1)
   this.totalItem.set(result.count)
   this.finalItem.set(((result.current-1)*5)+result.results.length)
   this.previousPage.set(result.previous)
   this.nextPage.set(result.next)
   this.commentList=result.results 

 },
 error:(error:any)=>{
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
 
 }
 





 comment= {
    id: 2,
    username: "Username0",
    post: "updated title",
    content: "Morning full assume now culture. Weight run probably budget local your. Husband language between able really fast.",
    timestamp: "2024-04-22 00:00",
}

constructor(private commentService:CommentService, private router:Router){}

ngOnInit(): void {

  
}

ngOnChanges(changes: SimpleChanges): void {

  if(this.postId){

    this.commentService.listComments(this.postId).subscribe(this.observer)
  }



}

back(){
  this.commentService.listCommentsPage(this.previousPage()).subscribe(this.observer)
 }

 next(){
  this.commentService.listCommentsPage(this.nextPage()).subscribe(this.observer)
 }



}