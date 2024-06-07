import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import{HttpClient} from '@angular/common/http'
import {AuthService} from '../services/auth.service'
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private logInUrl=`http://localhost:8000/user/login/`;

  constructor(private http:HttpClient, private AuthService: AuthService) { }

  login(data:any){
    return this.http.post(this.logInUrl,data,{withCredentials:true}).pipe(
      map((response)=>{
          this.AuthService.saveUser(response)
          return response
      })
    )
  }
}
