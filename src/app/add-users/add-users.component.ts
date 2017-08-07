import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUSersComponent implements OnInit {
  database: AngularFireDatabase;
  password: string;
  user_name:string;
  email:string="";
  imageUrl:string;
  users: FirebaseListObservable<any[]>;
  userList=[];
  userObject={
  email: "",
  user_name:"",
  admin_access:false,
  manager_access:false,
  imageUrl:""
  }
  constructor(public authService: AuthService, private router:Router,db: AngularFireDatabase) {
    this.database=db;
  this.users=db.list("/users");
  this.users.subscribe((user)=>{
    this.userList.push(user);
     console.log(this.userList[0])
  })
   }
userObj$;
userKey:string;
showUser=false;
getUser(key:string){
  this.showUser=true;
this.userKey=key
  let user;
this.database.object(`users/${key}`).subscribe((retrievedUser)=>{
    user=retrievedUser;
  });
  this.userObject=user;
  console.log(user)
}
deleteUser(key){
  this.database.object(`users/${this.userKey}`).remove();
 alert("User Deleted")
}
saveUser(){
  console.log(this.userObject)
  this.database.object(`users/${this.userKey}`).update({
     user_name:this.userObject.user_name,
      email:this.userObject.email,
    admin_access:this.userObject.admin_access,
    manager_access:this.userObject.manager_access,
    imageUrl:this.userObject.imageUrl
  })
  alert("saved ")
}
    signup() {
      this.email=`${this.email}@thorntontomasetti.com`
     this.authService.signup(this.email, this.password, this.user_name);
         this.users.push({
      user_name:this.user_name,
      email:this.email,
      admin_access:false,
      manager_access:false,
      imageUrl:this.imageUrl
    })
     this.userObject.email=this.email;
     this.userObject.imageUrl=this.imageUrl;
     this.userObject.user_name=this.user_name;
   

    alert("user added")


 this.userObject.email = this.password = '';
  }

  ngOnInit() {
 
  }
toHome(){
  this.router.navigate(["/home"])
}

}
