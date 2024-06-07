import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import{MatButtonModule} from '@angular/material/button'
import { SignupComponent } from '../../../pages/signup/signup.component';
import {MatdialogComponent} from '../matdialog/matdialog.component'
import { AuthService } from '../../../services/auth/auth.service';
import { User, authUser } from '../../models/user';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet,MatDialogModule,MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

public user:authUser|null=null;

  constructor(public dialog: MatDialog, private authserv:AuthService, private logService:LoginService) {}



  renderDialog(obj:{login:boolean}){
    
    const dialogRef = this.dialog.open(MatdialogComponent,{data:obj});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    this.user=this.authserv.getUser()


  }

  ngOnInit(): void {
    this.user=this.authserv.getUser()
  }
  

  logoutb(){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.logService.logout().subscribe({next:response=>{
          console.log(response)
             swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
       
        },
      
      error:err=>{
        console.log(err)
      
      
      }})
      

     


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });


  }

}



