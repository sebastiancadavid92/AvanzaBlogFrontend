import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissioncategoryService {

  private urlCategory=`${environment.URLAPI}categories`
  private urlPermission=`${environment.URLAPI}permissions`

  constructor(private http:HttpClient) { }

  categories(){
    return this.http.get(this.urlCategory).pipe(
      map((result:any)=>{
        return result.map((item:any)=>{
          const verboseName= item.categoryname.toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char:any) => char.toUpperCase());
          return {...item , verboseName}
        })
  

      }),
    )
  }

  permissions(){
    return this.http.get(this.urlPermission).pipe(
      map((result:any)=>{
        return result.map((item:any)=>{
          const verboseName= item.permissionname.toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char:any) => char.toUpperCase());
          return {...item , verboseName}
        })
  

      }),

    )
  }

}
