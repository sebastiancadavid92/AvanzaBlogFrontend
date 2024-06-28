import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {SingUp,User} from '../../shared/models/user'

@Injectable({
  providedIn: 'root'
})
export class SingupService {


  private singupUrl=`${environment.URLAPI}user/register/`;
  private checkemailurl=`${environment.URLAPI}user/api/checkemail/`
  private checkusernamelurl=`${environment.URLAPI}user/api/checkusername/`
  constructor(
    private http:HttpClient
  ) { }


  register (dto:SingUp){
    return this.http.post<User>(this.singupUrl,dto)
  }

  checkEmail(email:string){
    return this.http.get<{emailtook:boolean}>(`${this.checkemailurl}${email}/`)
  }
  checkUsername(username:string){
    return this.http.get<{usernametook:boolean}>(`${this.checkusernamelurl}${username}/`)
  }

  
}
