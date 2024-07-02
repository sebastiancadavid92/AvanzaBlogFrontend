import { Component, inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupComponent } from '../../../pages/signup/signup.component'
import { Inject } from '@angular/core'
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../../../pages/login/login.component';

@Component({
  selector: 'app-matdialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SignupComponent, LoginComponent],
  templateUrl: './matdialog.component.html',
  styleUrl: './matdialog.component.css'
})
export class MatdialogComponent {
 loginFlag: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public dat: { login: boolean },
    public dialogRef: MatDialogRef<MatdialogComponent>) {
    this.loginFlag = dat.login
  }

  fromChild(event: Event) {
    this.toogle()
  }

  toogle() {
    if (this.loginFlag) {
      this.loginFlag = false
      return
    }
    this.loginFlag = true
  }

  get logingFlag() {
    return this.loginFlag
  }
}

