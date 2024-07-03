import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component'
import {SignupComponent}from './pages/signup/signup.component'
import {NavbarComponent}from './shared/Component/navbar/navbar.component'
import{HomeComponent} from './pages/home/home.component'
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { DetailPostComponent } from './pages/detail-post/detail-post.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { PostFormComponent } from './shared/Component/post-form/post-form.component';


export const routes: Routes = [

    { 
        path:'',
        component:NavbarComponent,
        children:[
            {
                path:'',
                loadComponent:()=>import('./pages/home/home.component').then((c)=>c.HomeComponent)
            }
            ,

            {
                path:'edit/:id',
                loadComponent:()=>import('./pages/edit-post/edit-post.component').then((c)=>c.EditPostComponent)
            },
            {
                path:'post/:id',
                loadComponent:()=>import('./pages/detail-post/detail-post.component').then((c)=>c.DetailPostComponent)
            },
            {
                path:'newpost',
                loadComponent:()=>import('./pages/new-post/new-post.component').then((c)=>c.NewPostComponent)
            }


        ]


        


    },
    {path:'postform',
        component:PostFormComponent
    }




];
