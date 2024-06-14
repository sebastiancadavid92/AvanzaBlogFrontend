import { Component, OnInit, signal } from '@angular/core';
import { BpostComponent } from '../bpost/bpost.component';
import {Post}from'../../models/post'
import { PostService } from '../../../services/post/post.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Observer } from 'rxjs';
@Component({
  selector: 'app-bpostlist',
  standalone: true,
  imports: [BpostComponent,PaginatorComponent],
  templateUrl: './bpostlist.component.html',
  styleUrl: './bpostlist.component.css'
})



export class BpostlistComponent implements OnInit{
 public bPostList?:[Post];
 initItem= signal(3)
 finalItem=signal(5)
 totalItem=signal(8)
 previousPage=signal('')
 nextPage=signal('')

 observer={next:(result:any)=>{
  this.initItem.set(((result.current-1)*10)+1)
  this.totalItem.set(result.count)
  this.finalItem.set(((result.current-1)*10)+result.results.length)
  this.previousPage.set(result.previous)
  this.nextPage.set(result.next)
  this.bPostList=result.results 
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Esto hace que el desplazamiento sea suave
  })
},
error:(err:any)=>{
  alert('err')
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
  

}
