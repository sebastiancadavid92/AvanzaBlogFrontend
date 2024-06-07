import { Injectable } from '@angular/core';

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
}
