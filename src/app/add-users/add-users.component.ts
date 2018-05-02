import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUSersComponent implements OnInit {
  user: FirebaseObjectObservable<any>;
  database: AngularFireDatabase;
  password: string = '';
  user_name: string = '';
  email: string = '';
  imageUrl: string = '';
  users: FirebaseListObservable<any[]>;
  userList = [];
  userObject = {
    email: '',
    user_name: '',
    admin_access: false,
    manager_access: false,
    imageUrl: ''
  }

  userObj$;
  userKey: string;
  showUser = false;
  constructor(public authService: AuthService, private router: Router, db: AngularFireDatabase) {
    this.database = db;
  }

  getUser(key: string) {
    this.showUser = true;
    this.userKey = key
    let user;
    this.database.object(`users/${key}`).subscribe((retrievedUser) => {
      user = retrievedUser;
    });
    this.userObject = user;

  }

  getUsers() {
    this.users = this.database.list('/users');
    this.users.subscribe((user) => {
      this.userList.push(user);
    })
  }
  deleteUser() {
    this.database.object(`users/${this.email}`).remove()
    .then(
      () => alert('User Deleted')
    )
  }
  saveUser() {
    this.database.object(`users/${this.userKey}`).update({
      user_name: this.userObject.user_name,
      email: this.userObject.email,
      admin_access: this.userObject.admin_access,
      manager_access: this.userObject.manager_access,
      imageUrl: this.userObject.imageUrl
    }).then(
      () => alert('saved ')
    )
  }
  signup() {
    const emailID = this.email.toLowerCase();
    const user = emailID;
    this.authService.signup(emailID, this.password, this.user_name);
    this.database.object(`/users/${user}`)
    .set({
      user_name: this.user_name,
      email: (`${emailID}@thorntontomasetti.com`),
      admin_access: false,
      manager_access: false,
      imageUrl: this.imageUrl,
      short_name: user
    }).then(
      () => {
        // this.getUsers();
        alert('user added');
        this.email = '';
        this.user_name = '';
        this.imageUrl = '';
        this.password = '';
      }
    )
    // this.userObject.email = this.email;
    // this.userObject.imageUrl = this.imageUrl;
    // this.userObject.user_name = this.user_name;
    // this.userObject.email = this.password = '';
  }
  ngOnInit() {
    this.authService.user.subscribe((val => { this.routeThis(val) }))
    this.getUsers();

  }
  routeThis(val) {
    if (!val) {
      this.router.navigate(['']);
    }
  }
  toHome() {
    this.router.navigate(['/home'])
  }

}
