import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  auth: firebase.auth.Auth;
  user: Observable<firebase.User>;
<<<<<<< HEAD
  userName:string;
  isLoggedIn:boolean;
  constructor(private firebaseAuth: AngularFireAuth,private router:Router, ) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string , displayName:string) {
    alert(displayName)
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        return user.updateProfile({displayName:displayName})
      
      })
      .catch(err => {
        alert(`'Something went wrong:',${err.message}`);
      });   
     
  }
=======
  userName: string;
  isLoggedIn: boolean;
  
  constructor(private firebaseAuth: AngularFireAuth, private router: Router, ) {
    this.user = firebaseAuth.authState;
  }

  // signup(email: string, password: string, displayName: string) {
  //   alert(displayName)
  //   this.firebaseAuth
  //     .auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(user => {
  //       console.log(user);
  //       return user.updateProfile({ displayName: displayName })

  //     })
  //     .catch(err => {
  //       alert(`'Something went wrong:',${err.message}`);
  //     });

  // }
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
<<<<<<< HEAD
        console.log(value)
        if(this.firebaseAuth.auth){
          this.userName=value.email;
          if(this.firebaseAuth.auth.currentUser){ this.isLoggedIn=true;}
         
           this.router.navigate(["home"]);
           
        }
          else{
             this.router.navigate([""]);
          }
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
       this.sendUser()
  }
  sendToken(){
    if(this.firebaseAuth.auth.currentUser){
      return true;
    }
    else{
=======
        //console.log(value)
        if (this.firebaseAuth.auth) {
          this.userName = value.email;
          if (this.firebaseAuth.auth.currentUser) { this.isLoggedIn = true; }

          this.router.navigate(["home"]);

        }
        else {
          alert('Username or Password is not correct!');
          this.router.navigate([""]);
        }
        //console.log(value);
      })
      .catch(err => {
        alert(`'Something went wrong:', ${err.message}`);
      });
  }
  sendToken() {
    if (this.firebaseAuth.auth.currentUser) {
      return true;
    }
    else {
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b
      return false;
    }
  }
  logout() {
    this.sendToken();
    this.firebaseAuth
      .auth
      .signOut();

<<<<<<< HEAD
      this.router.navigate([""]);
  }
      sendUser(){
      
     
  }
  resetPassword(email){
     this.auth = firebase.auth();


    this.auth.sendPasswordResetEmail(email).then(function() {
      alert(`email sent to ${email}`)
    }, function(error) {
=======
    this.router.navigate([""]);
  }

  resetPassword(email) {
    this.auth = firebase.auth();


    this.auth.sendPasswordResetEmail(email).then(function () {
      alert(`email sent to ${email}`)
    }, function (error) {
>>>>>>> 01abb4ce3bccb9968522feae2cc3ea8a8b42710b
      alert("try again")
    });
  }


}