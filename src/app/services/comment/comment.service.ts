import { EnvironmentInjector, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import{environment} from'../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private listCommentsUrl=`${environment.URLAPI}comments/?post=`;


  constructor(private http:HttpClient) { }

  listComments(postId:number){
    return this.http.get(`${this.listCommentsUrl}${postId}`,{withCredentials:true})
  }
  listCommentsPage(url:string){
    return this.http.get(url,{withCredentials:true})
  }
  deleteComment(postId:number,commentId:number){
    return this.http.delete(`${environment.URLAPI}post/${postId}/comment/${commentId}`,{withCredentials:true})
  }


}
