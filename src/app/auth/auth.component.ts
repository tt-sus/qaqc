import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  email: string;
  password: string;

  constructor(public authService: AuthService,private router:Router) {}

  signup() {
    this.authService.signup(this.email, this.password);
   
    this.email = this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password);
    // this.router.navigate(["home"]);
    
    this.email = this.password = '';    
  }

  logout() {
    this.authService.logout();
    //  this.router.navigate([""]);
  }
  ngOnInit() {
  }

}
