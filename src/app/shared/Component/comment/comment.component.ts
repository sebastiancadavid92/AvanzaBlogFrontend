
import { Component, EventEmitter, Input, Output } from '@angular/core';


import { Comment } from '../../models/post';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {


  @Input({required:true}) comment?:Comment|undefined;
  @Output() del=new EventEmitter()

  delete(){
    this.del.emit(this.comment?.id)
  }




}
