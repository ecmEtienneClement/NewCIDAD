import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BugService } from './bug.Service';
import firebase from 'firebase/app';
import 'firebase/auth';
@Injectable()
export class GardUpdateGuardBug implements CanActivate {
  constructor(private routeService: Router, private serviceBug: BugService) {}
  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const user_Id_Params: string = route.url[1].path;
    const params: number = +route.url[3].path;
    let user_Id_Bug_Verify: string = '';

    return new Promise((resolve, reject) => {
      if (isNaN(params) || params < 0) {
        alert('Attention ! Veillez ne pas injecté des données dans URL');
        this.routeService.navigate(['/ecm']);
        reject(false);
      }
      //Recupation du bug pour certifier l'id du user dans route.url[1].path

      this.serviceBug
        .recupbaseSoloBug(params)
        .then((data_value: any) => {
          if (data_value == null) {
            alert("Cet post n'existe pas !");
            this.routeService.navigate(['/ecm']);
            reject(false);
          } else {
            user_Id_Bug_Verify = data_value.user_Id;
            //Recuperation de l'id du user connecter
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                if (
                  user.uid !== user_Id_Params ||
                  user_Id_Params !== user_Id_Bug_Verify
                ) {
                  alert(
                    'Attention ! Cet post que vous tentez de modifié ne vous appartient pas !'
                  );
                  this.routeService.navigate(['/ecm']);
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
          alert('Une erreur est survenue update Bug ...!');
        });
    });
  }
}
