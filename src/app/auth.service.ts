import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  userName:string;
  isLoggedIn:boolean;
  constructor(private firebaseAuth: AngularFireAuth,private router:Router) {
    this.user = firebaseAuth.authState;
  }
 
  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });   
     
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        if(this.firebaseAuth.auth){
          this.userName=value.email;
          this.isLoggedIn=true;
           this.router.navigate(["home"]);
           
        }
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();

      this.router.navigate([""]);
  }
  checkManager(){
        if(this.firebaseAuth.authState){
       this.firebaseAuth.authState.subscribe((auth)=>{
         if(auth){
         return true
           
         }
          else{
          return false;
          }
       })
      }
  }

}