import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

import 'firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class GardGuard implements CanActivate {
  user_Id_Connect: string;
  user_Email_Connect: string | null;
  constructor(private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user_Id_Connect = user.uid;
          this.user_Email_Connect = user.email;
          resolve(true);
        } else {
          this.route.navigate(['/connexion']);
          reject(false);
        }
      });
    });
  }
}
