import { Component, OnInit, signal } from '@angular/core';
import { BpostComponent } from '../bpost/bpost.component';
import {Post}from'../../models/post'
import { PostService } from '../../../services/post/post.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-bpostlist',
  standalone: true,
  imports: [BpostComponent,PaginatorComponent],
  templateUrl: './bpostlist.component.html',
  styleUrl: './bpostlist.component.css'
})



export class BpostlistComponent implements OnInit{
 public bPostList?:[Post]|undefined|[any]=undefined;
 initItem= signal(0)
 finalItem=signal(0)
 totalItem=signal(0)
 previousPage=signal('')
 nextPage=signal('')

 observer={next:(result:any)=>{
  this.initItem.set(((result.current-1)*10)+1)
  this.totalItem.set(result.count)
  this.finalItem.set(((result.current-1)*10)+result.results.length)
  this.previousPage.set(result.previous)
  this.nextPage.set(result.next)
  if(this.totalItem()==0){
    this.bPostList=undefined
  }
  else{
    this.bPostList=result.results
  }
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
},
error:(err:any)=>{
  if(err.status==0){
    Swal.fire({
      title:'Error',
      icon:'error',
      text:'We couldnt stablish conection to the server , try again later'
    })
  }

  else{
    Swal.fire({
      title:'Error',
      icon:'error',
      text:'We couldnt stablish conection to the server , try again later'
    })
  } 
}

}

 constructor(private postService:PostService){}

 ngOnInit(): void {
  this.postService.listPost().subscribe(this.observer)   
 }

 back(){
  this.postService.listPostPage(this.previousPage()).subscribe(this.observer)
 }

 next(){
  this.postService.listPostPage(this.nextPage()).subscribe(this.observer)
 }
 postDelete(){
  this.postService.listPost().subscribe(this.observer) 
 }
}
