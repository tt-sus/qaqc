import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {Http} from '@angular/http'
import * as _ from 'underscore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit   {

  constructor(  public authService: AuthService,
                private router:Router,
                private auth: AngularFireAuth,private http:Http){
            
        if(this.auth.authState){
       this.auth.authState.subscribe((auth)=>{
         if(auth){
           this.authService.isLoggedIn=true;
         
<<<<<<< HEAD
           
=======
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b
         }
          else{
           this.authService.isLoggedIn=false;
          }
       })
      }
  
  }
  logout(){
    this.authService.logout();
  }
<<<<<<< HEAD
=======

  goToProjects(){
  this.router.navigate(['home']);
  }
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b
  checkLogin(){

    if(this.authService.isLoggedIn){
      return true;
    }
    else{
      return false;
    }
  }

<<<<<<< HEAD
   ngOnInit() {
 
    
    }
=======
   ngOnInit() {}
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b
    

}
