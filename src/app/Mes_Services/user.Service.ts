import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Injectable } from '@angular/core';
import { GardGuard } from './gard.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class UserService {
  user_Id_Connect: string;
  objUser: any = {
    nom: '',
    prenom: '',
    promotion: '',
    fantome: '',
    securite: '',
  };

  constructor(private authService: GardGuard, private _snackBar: MatSnackBar) {}
  //Recuperation des Informations du  User
  //TODO
  getInfoUser(Id_User: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .doc(Id_User)
        .get()
        .then((data_User) => {
          if (data_User.exists) {
            resolve(data_User.data());
          } else {
            reject(false);
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    });
  }

  //Methode pour verifier Les Info du User dans la cache
  //TODO
  VerifyLocaleStorage(): Promise<any> {
    this.user_Id_Connect = this.authService.user_Id_Connect;

    return new Promise((resolve) => {
      if (
        localStorage.getItem('nomUserConnected') == null ||
        localStorage.getItem('prenomUserConnected') == null ||
        localStorage.getItem('modeNaveUserConnected') == null ||
        localStorage.getItem('securiteUserConnected') == null ||
        localStorage.getItem('promoUserConnected') == null
      ) {
        this.getInfoUser(this.user_Id_Connect)
          .then((data_User) => {
            this.objUser.nom = data_User.nom;
            this.objUser.prenom = data_User.prenom;
            this.objUser.promotion = data_User.promotion;
            this.objUser.fantome = data_User.fantome;
            this.objUser.securite = data_User.securite;

            localStorage.setItem('nomUserConnected', data_User.nom);
            localStorage.setItem('prenomUserConnected', data_User.prenom);
            localStorage.setItem('promoUserConnected', data_User.promotion);
            localStorage.setItem('modeNaveUserConnected', data_User.fantome);
            localStorage.setItem('securiteUserConnected', data_User.securite);
            resolve(this.objUser);
          })
          .catch(() => {
            const message =
              "Une erreur inattendu ! l'or de la recupération de vos données ! Vérifier votre connexion ...";
            this.openSnackBar(message, 'ECM');
          });
      } else {
        this.objUser.nom = localStorage.getItem('nomUserConnected');
        this.objUser.prenom = localStorage.getItem('prenomUserConnected');
        this.objUser.promotion = localStorage.getItem('promoUserConnected');
        this.objUser.fantome = localStorage.getItem('modeNaveUserConnected');
        this.objUser.securite = localStorage.getItem('securiteUserConnected');
        resolve(this.objUser);
      }
    });
  }
  //Suppressions des Informations du  User
  //TODO
  deleteInfoUser(Id_User: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .doc(Id_User)
        .delete()
        .then(() => {
          resolve(false);
        })
        .catch((error) => {
          console.log('Error getting document:', error);
          reject(false);
        });
    });
  }

  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
