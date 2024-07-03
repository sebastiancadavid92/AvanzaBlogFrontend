import { Component, Input, OnChanges, OnInit, SimpleChanges, signal } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { CommentService } from '../../../services/comment/comment.service';
import { Comment } from '../../models/post';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaginatorComponent } from '../paginator/paginator.component';
import { jsDocComment } from '@angular/compiler';

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
  commentList?:[Comment]|undefined=undefined;

  initItem= signal(0)
  finalItem=signal(0)
  totalItem=signal(0)
  previousPage=signal('')
  nextPage=signal('')
 


constructor(private commentService:CommentService, private router:Router){}

ngOnInit(): void {

  
}

ngOnChanges(changes: SimpleChanges): void {

  if(this.postId){

    this.commentService.listComments(this.postId).subscribe(  {next:(result:any)=>{

      this.initItem.set(((result.current-1)*5)+1)
      this.totalItem.set(result.count)
      this.finalItem.set(((result.current-1)*5)+result.results.length)
      this.previousPage.set(result.previous)
      this.nextPage.set(result.next)
      this.commentList=result.results 
   
    },
    error:(error:any)=>{
       Swal.fire(
       {
         icon: "error",
         title: "Oops...",
         text: JSON.stringify(error),
       }
   
   
       ).then((result)=>{
       this.router.navigate(['/'])
         
       })
    }
    
    }
    )
  }

}

back(){
  this.commentService.listCommentsPage(this.previousPage()).subscribe(  {next:(result:any)=>{

    this.initItem.set(((result.current-1)*5)+1)
    this.totalItem.set(result.count)
    this.finalItem.set(((result.current-1)*5)+result.results.length)
    this.previousPage.set(result.previous)
    this.nextPage.set(result.next)
    this.commentList=result.results 
 
  },
  error:(error:any)=>{
     Swal.fire(
     {
       icon: "error",
       title: "Oops...",
       text: JSON.stringify(error),
     }
 
 
     ).then((result)=>{
     this.router.navigate(['/'])
       
     })
  }
  
  }
  )
 }

 next(){
  this.commentService.listCommentsPage(this.nextPage()).subscribe(  {next:(result:any)=>{

    this.initItem.set(((result.current-1)*5)+1)
    this.totalItem.set(result.count)
    this.finalItem.set(((result.current-1)*5)+result.results.length)
    this.previousPage.set(result.previous)
    this.nextPage.set(result.next)
    this.commentList=result.results 
 
  },
  error:(error:any)=>{
     Swal.fire(
     {
       icon: "error",
       title: "Oops...",
       text: JSON.stringify(error),
     }
 
 
     ).then((result)=>{
     this.router.navigate(['/'])
       
     })
  }
  
  }
  )
 }

delete(event:any){
  if(this.postId){
    this.commentService.deleteComment(this.postId,event).subscribe(
      {
        next:()=>{Swal.fire({icon:'success',title:'comment deleted successfuly'}).then(
          ()=>{
            if(this.postId)
            this.commentService.listComments(this.postId).subscribe(  {next:(result:any)=>{

              this.initItem.set(((result.current-1)*5)+1)
              this.totalItem.set(result.count)
              this.finalItem.set(((result.current-1)*5)+result.results.length)
              this.previousPage.set(result.previous)
              this.nextPage.set(result.next)
              this.commentList=result.results 
           
            },
            error:(error:any)=>{
               Swal.fire(
               {
                 icon: "error",
                 title: "Oops...",
                 text: JSON.stringify(error),
               }
           
           
               ).then((result)=>{
               this.router.navigate(['/'])
                 
               })
            }
            
            }
            )
          }
        )
      
      },
        error:(err)=>{
          Swal.fire({icon:'warning',title:'Ooops Something wrong happened',text:JSON.stringify(err)})
        }

      }
      );
      
    
      
    
  }
}

}