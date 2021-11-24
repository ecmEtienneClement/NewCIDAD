import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BugService } from './bug.Service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from './user.Service';
@Injectable()
export class GardUpdateGuardBug implements CanActivate {
  constructor(
    private routeService: Router,
    private serviceBug: BugService,
    private userService: UserService
  ) {}
  //TODO
  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const user_Id_Params: string = route.url[1].path;
    const params: number = +route.url[3].path;
    const bug_Id_Params: string = route.url[4].path;
    const userIdFBLocal: string | null =
      this.userService.VerifyUserIdFBLocaleStorage().userIdFB;
    return new Promise((resolve, reject) => {
      if (isNaN(params) || params < 0) {
        alert('Attention ! Veillez ne pas injecté des données dans URL');
        this.routeService.navigate(['/ecm']);
        return reject(false);
      }
      //On verifi d'abord l'id en local
      if (userIdFBLocal != null && userIdFBLocal != '') {
        this.serviceBug
          .verifyUserUpdateBug(bug_Id_Params, user_Id_Params, params)
          .then(() => {
            if (userIdFBLocal !== user_Id_Params) {
              alert(
                'Attention !!! Nous constatons que vous essayez de vous faire passé pour un autre utilisateur ...'
              );
              this.routeService.navigate(['/ecm']);
              return reject(false);
            } else {
              return resolve(true);
            }
          })
          .catch(() => {
            this.routeService.navigate(['/ecm']);
            return reject(false);
          });
        //pour empecher de continuer
        return;
      }
      //Recuperation de l'id du user connecter si il n'a op id en local
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.serviceBug
            .verifyUserUpdateBug(bug_Id_Params, user_Id_Params, params)
            .then(() => {
              if (userIdFBLocal !== user_Id_Params) {
                alert(
                  'Attention !!! Nous constatons que vous essayez de vous faire passé pour un autre utilisateur ...'
                );
                this.routeService.navigate(['/ecm']);
                return reject(false);
              } else {
                return resolve(true);
              }
            })
            .catch(() => {
              this.routeService.navigate(['/ecm']);
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
