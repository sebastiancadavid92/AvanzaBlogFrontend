import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component'
import {SignupComponent}from './pages/signup/signup.component'
import {NavbarComponent}from './shared/Component/navbar/navbar.component'
import{HomeComponent} from './pages/home/home.component'
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { DetailPostComponent } from './pages/detail-post/detail-post.component';
import { NewPostComponent } from './pages/new-post/new-post.component';


export const routes: Routes = [

    { 
        path:'',
        component:NavbarComponent,
        children:[
            {
                path:'',
                component:HomeComponent
            }
            ,

            {
                path:'edit/:id',
                component:EditPostComponent
            },
            {
                path:'post/:id',
                component:DetailPostComponent
            },
            {
                path:'newpost',
                component: NewPostComponent
            }


        ]
        


    },




];
