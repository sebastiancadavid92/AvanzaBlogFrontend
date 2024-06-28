import { Component, EventEmitter, inject,Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import{RegisterValidators} from '../../shared/validators/namevalidator'
import {SingupService}from '../../services/singup/singup.service'
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import{Inject} from'@angular/core'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})


export class SignupComponent {

  
  registerform: FormGroup;
  termsConditions= new FormControl<boolean>(false,[Validators.requiredTrue]);
  maxdate!:string;
  invalidform=false;
  private SignupServ=inject(SingupService);
  private subscription:Subscription=new Subscription();
  private loginFlag:boolean=true;
  
  @Output() loginPage= new EventEmitter();
  

  constructor(
    ){

    this.registerform=new FormGroup(
      {
        username: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+$/)]),
        email: new FormControl('',[Validators.required,Validators.pattern(/^[a-z_0-9-.]+@[a-z]+\.[a-z]+$/)],[RegisterValidators.emailAsyncValidator(this.SignupServ)]),
        first_name: new FormControl('',[Validators.pattern( /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+$/)]),
        last_name: new FormControl('',Validators.pattern( /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+$/)),
        birthdate: new FormControl(null),
        password: new FormControl('',[Validators.required]),
        passwordconfirmation: new FormControl('',[Validators.required]),

      },{
        validators:RegisterValidators.matchPasswords
      }
    )

  }



  ngOnInit(): void {
    const today = new Date();
    this.maxdate= new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];


  }


 get email()
{
  return this.registerform.get('email')!

}


get firstName()
{
  return this.registerform.get('first_name')!

}

get lastName()
{
  return this.registerform.get('last_name')!

}

get password()
{
  return this.registerform.get('password')!

}
get passwordConfirmation()
{
  return this.registerform.get('passwordconfirmation')!

}
get userName()
{
  return this.registerform.get('username')!

}

ngOnDestroy(): void {

  this.subscription.unsubscribe();
}

onBlur(){
  
  if(this.userName.invalid){
    return
  }
  this.userNameValidator()


}
get Flag(){
  return this.loginFlag

}



userNameValidator(){
  if (this.userName.value!==''){

    const control=this.userName
    const validator=RegisterValidators.usernameAsyncValidator(this.SignupServ)
    this.subscription=validator(control).subscribe(error => { 
      control.setErrors(error)
    }

    
  )
  }
}


  save(event: Event) {

    if (this.termsConditions.invalid ||this.registerform.invalid){
      this.invalidform=true
      this.registerform.markAllAsTouched()
      this.termsConditions.markAsTouched({onlySelf:true})
      return
    }
    const data=this.registerform.value;
    this.SignupServ.register(data).subscribe({next:response => {
      console.log("exito. respuesta:")
      console.log( response);
      swal.fire({
        icon: "success",
        title: "New user registered successfully",
        showConfirmButton: false,
        timer: 1000
      });
      this.loginPage.emit(true)
      this.registerform.reset();

    }, error:error => {
      console.log("error:")
      console.log(error.error)
      console.error('Error al enviar los datos:', error);
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });;
    }});


  }

  cancel(event:Event){
    this.registerform.reset()
  }


}
