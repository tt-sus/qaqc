import { Component, OnInit } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";

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
                private auth: AngularFireAuth){
            
        if(this.auth.authState){
       this.auth.authState.subscribe((auth)=>{
         if(auth){
           this.authService.isLoggedIn=true;
           console.log(auth.email)
           
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
  checkLogin(){

    if(this.authService.isLoggedIn){
      return true;
    }
    else{
      return false;
    }
  }

   ngOnInit() {
 
    
    }
    

}
