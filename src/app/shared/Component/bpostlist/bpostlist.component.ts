import { Component, OnInit } from '@angular/core';
import { BpostComponent } from '../bpost/bpost.component';
import {Post}from'../../models/post'
import { PostService } from '../../../services/post/post.service';
@Component({
  selector: 'app-bpostlist',
  standalone: true,
  imports: [BpostComponent],
  templateUrl: './bpostlist.component.html',
  styleUrl: './bpostlist.component.css'
})
export class BpostlistComponent implements OnInit{
 public bPostList?:[Post];
 

 constructor(private postService:PostService){}


 ngOnInit(): void {
  this.postService.listPost().subscribe({next:(result:any)=>{
    this.bPostList=result.results
  
  }})

   
 }
  

}
