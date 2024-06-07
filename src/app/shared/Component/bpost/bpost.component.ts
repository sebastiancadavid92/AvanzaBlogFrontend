import { Component,Input, OnInit } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Post}from'../../models/post'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bpost',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,CommonModule],
  templateUrl: './bpost.component.html',
  styleUrl: './bpost.component.css'
})
export class BpostComponent implements OnInit  {
  @Input({required:true}) bPost?:Post;
  public longText='';

  constructor(){



  }
  ngOnInit(): void {
    this.longText=this.bPost?.excerpt??'';
  }

  


}
