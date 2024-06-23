import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import{environment} from'../../../environments/environment'
import { newPost } from '../../shared/models/post';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private listPostUrl=`${environment.URLAPI}post/`;
  //http://localhost:8000/post/21/like/
  //http://localhost:8000/post/?page=2
  

  constructor(private http:HttpClient) { }

  getPost(postId:number){
    return this.http.get(`${this.listPostUrl}${postId}`,{withCredentials:true}) 
  }

  newPost(data:newPost){
    return this.http.post(this.listPostUrl,data,{withCredentials:true})
  }
  updatePost(data:newPost,postId:number|null){
    return this.http.patch(`${this.listPostUrl}${postId}/`,data,{withCredentials:true})
  }

  listPost(){
    return this.http.get(this.listPostUrl,{withCredentials:true})
  }

  listPostPage(url:string){
    return this.http.get(url,{withCredentials:true})
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

  commentPost(postId:number|undefined,commentContent:any){
    if (postId){
      return this.http.post(`${environment.URLAPI}post/${postId}/comment/`,commentContent,{withCredentials:true})
    }
    else{
      return null
    }
  }

}
