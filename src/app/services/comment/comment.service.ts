import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import{environment} from'../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private listCommentsUrl=`${environment.URLAPI}comments/?post=`;

  constructor(private http:HttpClient) { }

  listComments(postId:number){
    return this.http.get(`${this.listCommentsUrl}${postId}`,)
  }
  listCommentsPage(url:string){

  }
}
