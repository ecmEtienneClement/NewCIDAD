import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPlugingService } from './appPlugin.Service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from './user.Service';

@Injectable()
export class GuardUpdatePluginGuard implements CanActivate {
  mode_Local_User_Connected: boolean | number;
  constructor(
    private routeService: Router,
    private appPluginService: AppPlugingService,
    private userService: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user_Id_Params: string = route.url[1].path;
    const id_Plugin_params: any = route.url[3].path;
    const userIdFBLocal: string | null =
      this.userService.VerifyUserIdFBLocaleStorage().userIdFB;

    //TODO
    return new Promise((resolve, reject) => {
      if (!isNaN(id_Plugin_params) || id_Plugin_params < 0) {
        alert('Attention ! Veillez ne pas injecté des données dans URL');
        this.routeService.navigate(['/appPlugin']);
        reject(false);
      }

      //On verifi d'abord l'id en local
      if (userIdFBLocal != null && userIdFBLocal != '') {
        this.appPluginService
          .verifyUserUpdatePlugin(id_Plugin_params, user_Id_Params)
          .then(() => {
            if (userIdFBLocal !== user_Id_Params) {
              alert(
                'Attention !!! Nous constatons que vous essayez de vous faire passé pour un autre utilisateur ...'
              );

              this.routeService.navigate(['/appPlugin']);
              return reject(false);
            } else {
              return resolve(true);
            }
          })
          .catch(() => {
            this.routeService.navigate(['/appPlugin']);
            return reject(false);
          });
        return;
      }

      //Recuperation de l'id du user connecter
      firebase.auth().onAuthStateChanged((user) => {
        alert('dem');
        if (user) {
          this.appPluginService
            .verifyUserUpdatePlugin(id_Plugin_params, user_Id_Params)
            .then(() => {
              if (user.uid !== user_Id_Params) {
                alert(
                  'Attention !!! Nous constatons que vous essayez de vous faire passé pour un autre utilisateur ...'
                );
                this.routeService.navigate(['/appPlugin']);
                return reject(false);
              } else {
                return resolve(true);
              }
            })
            .catch(() => {
              this.routeService.navigate(['/appPlugin']);
              return reject(false);
            });
        } else {
          this.routeService.navigate(['/connexion']);
          reject(false);
        }
      });
    });
  }
}
