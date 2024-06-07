import { Injectable } from '@angular/core';
import { User} from '../../shared/models/user';
import { jsDocComment } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  saveUser(userData:any){
  localStorage.setItem('user',JSON.stringify({
    username:userData.username,
    id:userData.id,
    teamName:userData.team,
    teamId:userData.team_id,
  }))

  }

  getUser(){
    const user=localStorage.getItem('user');
    if(user){
      return JSON.parse(user)
    }
    return null
  }


  deleteUser(){
    localStorage.removeItem('user');


  }



}



