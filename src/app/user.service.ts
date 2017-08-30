import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './user';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UserService {
    private database: AngularFireDatabase;
    // userkey: string;
    //currentUser: string;
    private authUser:Observable<any>;
    static currentUser:User;

    constructor(private authService:AuthService,db: AngularFireDatabase,) {
        this.database=db;
        UserService.currentUser= this.getUserInfo();
        //console.log(ManagerService.currentUser);
     }
    
    private loggedInUser(){
        this.authUser=this.authService.user;
        return this.authUser;
    }
    private setCurrentUser(email){
       let $pos = email.indexOf('@');
       let shortEmail=email.substr(0, $pos);
       shortEmail=shortEmail.charAt(0).toUpperCase()+shortEmail.charAt(1).toUpperCase() + shortEmail.slice(2);
       let userInfoObj = this.database.object(`/users/${shortEmail}`);

       return userInfoObj
        
    }

    private getUserInfo(){
        let currentUser:User = new User();

        let authUser=this.loggedInUser();
        
        authUser.subscribe((user)=>{
            
            this.setCurrentUser(user.email).subscribe((user=>{
                currentUser.name =user.user_name;
                currentUser.$key = user.short_name;
                currentUser.email = user.email;
                currentUser.isAdmin = user.admin_access;
                currentUser.isManager = user.manager_access;
            }))
        })

        console.log("Welcome: "+currentUser.name);

        return currentUser;
        

    }

}