import { log } from 'util';
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
        const user = this.authService.user;
        return user;
    }
}
