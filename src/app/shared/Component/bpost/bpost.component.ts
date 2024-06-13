import { Component,Input, OnDestroy, OnInit, signal  } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Post}from'../../models/post'
import { authUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { PostService } from '../../../services/post/post.service';
import swal from 'sweetalert2';
import {OverlayModule} from '@angular/cdk/overlay';
import { UserlistComponent } from '../userlist/userlist.component';


@Component({
  selector: 'app-bpost',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,CommonModule,OverlayModule,UserlistComponent],
  templateUrl: './bpost.component.html',
  styleUrl: './bpost.component.css'
})
export class BpostComponent implements OnInit, OnDestroy {


  @Input({required:true}) bPost?:Post;
  user?:authUser;
  private userWatcher?:Subscription;
  longText='';
  liked=signal(false);
  edit:boolean|undefined=false;
  likes=signal(0);
  isOpenLikes = false;







  constructor(private authServ:AuthService, private postService:PostService){
  }




  ngOnInit(): void {
    this.user=this.authServ.getUser()
    this.userWatcher=this.authServ.wathcUser().subscribe({next:(result)=>{
      this.user=this.authServ.getUser()
    }})

    this.user=this.authServ.getUser()
    this.longText=this.bPost?.excerpt??'';
    this.liked.set(this.bPost?.liked??false)
    this.edit=this.bPost?.edit
    this.likes.set(this.bPost?.likes??0)
   
  }

  ngOnDestroy(): void {
    this.userWatcher?.unsubscribe()
  }

  likeHandler(){
    
    if(this.liked()){
      this.postService.dislike(this.bPost?.id).subscribe(
        {next:()=>{
          this.liked.set(false);
          this.likes.update(value=>value-1)
        },
        error:(error)=>{
          console.log(error)
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: JSON.stringify(error.error),
          })

        }
      })

    }

    else if (!this.liked()){
      this.postService.like(this.bPost?.id).subscribe(
        {next:(result)=>{
          this.likes.update(value=>value+1)
          this.liked.set(true);
        },
        error:(error)=>{
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: JSON.stringify(error.error),
          })

        }
      })
    }
    }

  comment(){
    console.log('comentar')

    }

  editer(){
    console.log('editing')
  }

  delete(){


    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn-success2',
        cancelButton: "btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this post?",
      icon: "warning",
      iconColor:"#00f0b7",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No!",
      reverseButtons: true
    }).then((result:any) => {
      if (result.isConfirmed) {

        this.postService.deletePost(this.bPost?.id).subscribe(
         {
          next:(result)=>{   
          swalWithBootstrapButtons.fire({
          text: " Post deleted successful",
          icon: "success",
          iconColor:"#00f0b7",
          showConfirmButton: false,
          timer: 800,
        }).then(()=>window.location.reload());

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

    



/*     this.postService.deletePost(this.bPost?.id).subscribe(
      {next:(result)=>{
        window.location.reload()

      },
      error:(err)=>{
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.stringify(err.error),
        })

      }

      }
    ) */


  }
    
}
  



