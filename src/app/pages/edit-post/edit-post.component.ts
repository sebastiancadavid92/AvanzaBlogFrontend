import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit{
  id:number|null=null;

  constructor(private router:ActivatedRoute){}


  ngOnInit(): void {
    this.router.paramMap.subscribe(params=>{
      this.id=Number(params.get('id'));
      console.log(this.id)
    })
  }

  
  }

