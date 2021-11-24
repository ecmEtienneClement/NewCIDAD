import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { LocalService } from './local.Service';

@Injectable({
  providedIn: 'root',
})
export class GardGuard implements CanActivate {
  //etat_User_Connected: boolean = false;
  mode_Local_User_Connected: boolean | number;
  user_Id_Connect: string | any;
  user_Email_Connect: string | null | any;
  constructor(private route: Router, private localService: LocalService) {}
  //Methode pour verifier l'autentification du user
  //TODO
  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      //Verification du modeLocal du User
      this.mode_Local_User_Connected = this.localService.verifyModeLocal();
      if (this.mode_Local_User_Connected == true) {
        //Verification de donne local
        if (this.localService.verifyDonneLocal()) {
          this.user_Id_Connect = localStorage.getItem('ECM_UI_FB');
          this.user_Email_Connect = localStorage.getItem('ECM_UM');
          return resolve(true);
        } else {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.user_Id_Connect = user.uid;
              this.user_Email_Connect = user.email;
              localStorage.setItem('ECM_UI_FB', this.user_Id_Connect);
              localStorage.setItem('ECM_UM', this.user_Email_Connect);
              resolve(true);
            } else {
              this.route.navigate(['/connexion']);
              reject(false);
            }
          });
        }
        return;
      }

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user_Id_Connect = user.uid;
          this.user_Email_Connect = user.email;
          localStorage.setItem('ECM_UI_FB', this.user_Id_Connect);
          localStorage.setItem('ECM_UM', this.user_Email_Connect);
          resolve(true);
        } else {
          this.route.navigate(['/connexion']);
          reject(false);
        }
      });
    });
  }
}
