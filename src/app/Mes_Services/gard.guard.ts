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
  constructor(private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user_Id_Connect = user.uid
          resolve(true);
        } else {
          this.route.navigate(['/connexion']);
          reject(false);
        }
      });
    });
  }
}
