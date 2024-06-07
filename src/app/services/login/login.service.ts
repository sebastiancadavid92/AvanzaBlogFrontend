import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import{HttpClient} from '@angular/common/http'
import {loginData} from '../../shared/models/user'
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import{User} from '../../shared/models/user'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private logInUrl=`${environment.URLAPI}user/login/`;
  private logOutUrl=`${environment.URLAPI}user/logout/`;
  

  constructor(private http:HttpClient, private authService:AuthService) { }



  login(data:loginData){
    return this.http.post(this.logInUrl,data,{withCredentials:true}).pipe(
      map((response)=>{
          this.authService.saveUser(response)
          return response
      })
    )
  }

  logout(){
  
    return this.http.get(this.logOutUrl,{withCredentials:true}).pipe(
      map(response=>{
        this.authService.deleteUser()
        return response
      })
    )

  }






}
