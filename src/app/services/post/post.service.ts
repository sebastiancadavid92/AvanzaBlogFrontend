import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import{environment} from'../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private listPostUrl=`${environment.URLAPI}post/`;
  //http://localhost:8000/post/21/like/
  

  constructor(private http:HttpClient) { }


  listPost(){
    return this.http.get(this.listPostUrl,{withCredentials:true})
  }

  like(postId:number|undefined){
    return this.http.post(`${environment.URLAPI}post/${postId}/like/`,{},{withCredentials:true})
  }

  dislike(postId:number|undefined){
    return this.http.delete(`${environment.URLAPI}post/${postId}/like/`,{withCredentials:true})
  }

  deletePost(postId:number|undefined){
    return this.http.delete(`${environment.URLAPI}post/${postId}/`,{withCredentials:true})
  }

}
