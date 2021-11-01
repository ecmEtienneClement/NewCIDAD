import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPlugin } from '../Models/modelApi';
import { AppPlugingService } from './appPlugin.Service';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class GuardUpdatePluginGuard implements CanActivate {
  constructor(
    private routeService: Router,
     private appPluginService: AppPlugingService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user_Id_Params: string = route.url[1].path;
    const params: any = route.url[3].path;
    let user_Id_Plugin_Verify: string = '';

    return new Promise((resolve, reject) => {
      if (!isNaN(params) || params < 0) {
        alert('Attention ! Veillez ne pas injecté des données dans URL');
        this.routeService.navigate(['/appPlugin']);
        reject(false);
      }

      //Recupation du bug pour certifier l'id du user dans route.url[1].path
      //Appelle de getDetailsPlugin
      //TODO
      this.appPluginService
        .getDetailsPlugin(params)
        .then((data_App_Plugin: AppPlugin) => {
          if (data_App_Plugin) {
            //Recuperation de l'id du plugin
            user_Id_Plugin_Verify = data_App_Plugin.userId;
            //Recuperation de l'id du user connecter
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                if (
                  user.uid !== user_Id_Params ||
                  user_Id_Params !== user_Id_Plugin_Verify
                ) {
                  alert(
                    'Attention ! Cet plugin que vous tentez de modifié ne vous appartient pas !'
                  );
                  this.routeService.navigate(['/appPlugin']);
                  reject(false);
                } else {
                  resolve(true);
                }
              } else {
                this.routeService.navigate(['/connexion']);
                reject(false);
              }
            });
          }
        })
        .catch(() => {
          alert("Cet plugin n'existe pas !");
          this.routeService.navigate(['/appPlugin']);
          reject(false);
        });
    });
  }
}
