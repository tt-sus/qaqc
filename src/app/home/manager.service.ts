import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Manager } from './manager';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ManagerService {
    database: AngularFireDatabase;
    userkey: string;
    currentUser: string;

    constructor(private authService: AuthService, db: AngularFireDatabase, ) {
        this.database = db;
    }
    loggedInUser() {
        let user = this.authService.user;
        return user;
    }
    setCurrentUser(email) {
        let $pos = email.indexOf('@');
        let shortEmail = email.substr(0, $pos);
        return this.database.object(`/users/${shortEmail}`)
    }
}