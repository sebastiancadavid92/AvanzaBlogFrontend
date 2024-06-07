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

 public posts:Post= {
    id: 32,
    author_name: "as",
    author_id: 28,
    title: "post sin categorias2",
    excerpt: "este es todo el contenido que tiene el post, se supone que debe tener mas de 200 caracteres para poder ver como funciona el metodo exctp pero no creo que logre alcanzar ese numero. o si? seguiere escr",
    team_name: "DEFAULT",
    team_id: 2,
    timestamp: "2024-06-05 19:09:52",
    comments: 50,
    likes: 20,
    permission: {
        PUBLIC: "READ_ONLY",
        AUTHOR: "EDIT",
        TEAM: "NONE",
        AUTHENTICATED: "NONE"
    },
    liked: false,
    edit: false,
}


}
