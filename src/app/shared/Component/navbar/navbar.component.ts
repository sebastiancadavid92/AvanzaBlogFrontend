import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import{MatButtonModule} from '@angular/material/button'
import { SignupComponent } from '../../../pages/signup/signup.component';
import {MatdialogComponent} from '../matdialog/matdialog.component'
import { AuthService } from '../../../services/auth/auth.service';
import { User, authUser } from '../../models/user';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { Observable, Subscriber,Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,MatDialogModule,MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit,OnDestroy{

  public user:authUser|null=null;
  private Userwathcer?:Subscription;

  constructor(public dialog: MatDialog, private authserv:AuthService, private logService:LoginService,private router:Router) {


  }


  renderDialog(obj:{login:boolean}){
    const dialogRef = this.dialog.open(MatdialogComponent,{data:obj});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    this.user=this.authserv.getUser()
  }


  ngOnInit(): void {
    this.user=this.authserv.getUser()
    this.Userwathcer=this.authserv.wathcUser().subscribe({next:result=>{
      this.user=this.authserv.getUser();
    },
    error:err=>{
      this.user=null;
    }
    });
  
  }

  home(){
    this.router.navigate(['/'])
  }

  ngOnDestroy(): void {

    this.Userwathcer?.unsubscribe()
  }
  

  isNewPost(){
    return this.router.isActive('newpost',{
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })
  }

  newPost(){

   this.router.navigate(['newpost'])
  }

  logoutb(){


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn-success2',
        cancelButton: "btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      iconColor:"#00f0b7",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.logService.logout().subscribe(
         {
          next:(result)=>{        
          swalWithBootstrapButtons.fire({
          text: "logout successful",
          icon: "success",
          iconColor:"#00f0b7",
          showConfirmButton: false,
          timer: 800,
        }).then(
        ()=>{this.router.navigate(['/'])}
        );
          },
          error:(err)=>{
            swalWithBootstrapButtons.fire({
              icon: "error",
              title: "Oops...Something went wrong!",
              text: err.error,
            });
            
          }


         } 
        )





      }
    });


  }








}



