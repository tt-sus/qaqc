import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';


@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(public authService: AuthService,) {}

  canActivate() {
    return this.authService.isLoggedIn;
  }
}