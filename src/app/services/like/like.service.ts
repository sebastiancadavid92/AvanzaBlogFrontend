import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import{environment} from'../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private listLikesUrl=`${environment.URLAPI}likes/?post=`;
  //http://localhost:8000/likes/?post=59&user=&page=2

  constructor(private http:HttpClient) { }

  listLikes(postId:number){
    return this.http.get(`${this.listLikesUrl}${postId}&page=${1}`,{withCredentials:true})
  }

  listLikePage(url:string){
    return this.http.get(url,{withCredentials:true})
  }




}
