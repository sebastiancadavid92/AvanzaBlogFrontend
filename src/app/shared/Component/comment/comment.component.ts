
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';


import { Comment } from '../../models/post';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnChanges {


  @Input({required:true}) comment?:Comment|undefined;

  ngOnChanges(changes: SimpleChanges): void {
   
    
  }


}
