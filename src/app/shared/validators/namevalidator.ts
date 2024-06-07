import { AbstractControl } from '@angular/forms';
import { ValidationErrors,AsyncValidatorFn } from '@angular/forms';
import {SingupService} from '../../services/singup/singup.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

export class RegisterValidators{



    
    static matchPasswords(control: AbstractControl) {

      const password = control.get('password')?.value;
      const confirmPassword = control.get('passwordconfirmation')?.value;

      if (password !== confirmPassword) {
        return {match_password: true};
      }
      return null;
    }


    static emailAsyncValidator(emailService: SingupService){
      return (control: AbstractControl)=> {
        const value= control.value;
        return emailService.checkEmail(value).pipe(
          
          map( response=>{
            return response.emailtook? {emailtook:true} :null
          })


        )

    }

  }

  static usernameAsyncValidator(Service: SingupService){
    return (control: AbstractControl)=> {
      const value= control.value;
      return Service.checkUsername(value).pipe(
  
        map( response=>{
          return response.usernametook? {usernametook:true} :null
        })


      )

  }

}

  


}