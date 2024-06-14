import { Component, OnInit } from '@angular/core';
import { BpostComponent } from '../../shared/Component/bpost/bpost.component';
import {Post}from'../../shared/models/post'
import { PostService } from '../../services/post/post.service';
import { BpostlistComponent } from '../../shared/Component/bpostlist/bpostlist.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BpostComponent,BpostComponent,BpostlistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  

  constructor(){

  }

  ngOnInit(): void {

  }



}
