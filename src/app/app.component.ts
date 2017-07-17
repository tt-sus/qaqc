import { Component, OnInit } from '@angular/core';


import * as _ from 'underscore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit   {

  constructor(  public authService: AuthService,
              private router:Router){

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
  // initialize to page 1
 
    
    }
    

}
