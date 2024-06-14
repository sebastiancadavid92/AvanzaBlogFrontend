import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { CommentService } from '../../../services/comment/comment.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommentComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit,OnChanges{
  @Input() postId:number=-1;

 comment= {
    id: 2,
    username: "Username0",
    post: "updated title",
    content: "Morning full assume now culture. Weight run probably budget local your. Husband language between able really fast.",
    timestamp: "2024-04-22 00:00",
}

constructor(private commentService:CommentService){}

ngOnInit(): void {
  
}

ngOnChanges(changes: SimpleChanges): void {
  
}

}