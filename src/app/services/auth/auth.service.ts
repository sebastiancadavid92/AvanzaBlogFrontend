import { Injectable } from '@angular/core';
import { User} from '../../shared/models/user';
import { jsDocComment } from '@angular/compiler';
import { BehaviorSubject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageSubject :BehaviorSubject<any>;
  private sotrageKey='user'


  constructor() {
    const storedValue=localStorage.getItem(this.sotrageKey)
    this.storageSubject=new BehaviorSubject(storedValue);
   }

  saveUser(userData:any){
    const user={ 
      username:userData.username,
      id:userData.id,
      teamName:userData.team,
      teamId:userData.team_id,}

  localStorage.setItem(this.sotrageKey,JSON.stringify(user));
  this.storageSubject.next(user);

  }

  getUser(){
    const user=localStorage.getItem(this.sotrageKey);
  
    if(user){
      return JSON.parse(user)
    }
    return null
  }


  deleteUser(){
    localStorage.removeItem(this.sotrageKey);
    this.storageSubject.next(null)

  }

  wathcUser(){

    return this.storageSubject.asObservable();
  }



}





