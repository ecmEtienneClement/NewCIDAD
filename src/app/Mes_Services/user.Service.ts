import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { Injectable } from '@angular/core';
import { GardGuard } from './gard.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserMoogoService } from './userMongo.Service';
import { UserECM } from '../Models/modelApi';

@Injectable()
export class UserService {
  user_Id_Connect: string;
  objUser: any = {
    nom: '',
    prenom: '',
    promotion: '',
    fantome: '',
    securite: '',
    ppUser: '',
  };
  user_ECM: UserECM = {
    TK: '',
    userIdFB: '',
    userIdMG: '',
  };

  constructor(
    private authService: GardGuard,
    private _snackBar: MatSnackBar,
    private userAuthMongo: UserMoogoService
  ) {}
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
          }
        })
        .catch(() => {
          reject(false);
        });
    });
  }
  //Methode pour enregistrer Pp du User
  //TODO
  onSavePpUser(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const UniqueName: string = Date.now().toString();
      const upload = firebase
        .storage()
        .ref()
        .child('PpUser/' + UniqueName + file.name)
        .put(file);

      upload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error) => {
          reject();
        },
        () => {
          resolve(upload.snapshot.ref.getDownloadURL());
        }
      );
    });
  }
  //Methode pour supprimer Pp du User
  //TODO
  onDeletePpUser(urlParams: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const urlDelete = firebase.storage().refFromURL(urlParams);
      urlDelete
        .delete()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }
  //Methode pour verifier Les Info du User dans la cache
  //TODO
  VerifyLocaleStorage(): Promise<any> {
    this.user_Id_Connect = this.authService.user_Id_Connect;

    return new Promise((resolve, reject) => {
      if (
        localStorage.getItem('nomUserConnected') == null ||
        localStorage.getItem('prenomUserConnected') == null ||
        localStorage.getItem('modeNaveUserConnected') == null ||
        localStorage.getItem('securiteUserConnected') == null ||
        localStorage.getItem('promoUserConnected') == null ||
        localStorage.getItem('ppUserConnected') == null
      ) {
        this.getInfoUser(this.user_Id_Connect)
          .then((data_User) => {
            this.objUser.nom = data_User.nom;
            this.objUser.prenom = data_User.prenom;
            this.objUser.promotion = data_User.promotion;
            this.objUser.fantome = data_User.fantome;
            this.objUser.securite = data_User.securite;
            this.objUser.ppUser = data_User.ppUser;

            localStorage.setItem('nomUserConnected', data_User.nom);
            localStorage.setItem('prenomUserConnected', data_User.prenom);
            localStorage.setItem('promoUserConnected', data_User.promotion);
            localStorage.setItem('modeNaveUserConnected', data_User.fantome);
            localStorage.setItem('securiteUserConnected', data_User.securite);
            localStorage.setItem(
              'ppUserConnected',
              window.btoa(data_User.ppUser)
            );
            resolve(this.objUser);
          })
          .catch(() => {
            const message =
              "Une erreur inattendu ! l'or de la recup??ration de vos donn??es ! V??rifier votre connexion ...";
            this.openSnackBar(message, 'ECM');
          });
      } else {
        try {
          this.objUser.nom = localStorage.getItem('nomUserConnected');
          this.objUser.prenom = localStorage.getItem('prenomUserConnected');
          this.objUser.promotion = localStorage.getItem('promoUserConnected');
          this.objUser.fantome = localStorage.getItem('modeNaveUserConnected');
          this.objUser.securite = localStorage.getItem('securiteUserConnected');
          const ppUserCrypt: any = localStorage.getItem('ppUserConnected');
          this.objUser.ppUser = window.atob(ppUserCrypt);
          resolve(this.objUser);
        } catch {
          this.updateInfoUserLocal();
          reject(false);
        }
      }
    });
  }

  //Methode pour mettre a jour les donnees user du local storage
  //TODO
  updateInfoUserLocal() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getInfoUser(user.uid)
          .then((data_User) => {
            this.objUser.nom = data_User.nom;
            this.objUser.prenom = data_User.prenom;
            this.objUser.promotion = data_User.promotion;
            this.objUser.fantome = data_User.fantome;
            this.objUser.securite = data_User.securite;
            this.objUser.ppUser = data_User.ppUser;

            localStorage.setItem('nomUserConnected', data_User.nom);
            localStorage.setItem('prenomUserConnected', data_User.prenom);
            localStorage.setItem('promoUserConnected', data_User.promotion);
            localStorage.setItem('modeNaveUserConnected', data_User.fantome);
            localStorage.setItem('securiteUserConnected', data_User.securite);
            localStorage.setItem(
              'ppUserConnected',
              window.btoa(data_User.ppUser)
            );
          })
          .catch(() => {
            const message =
              "Une erreur inattendu ! l'or de la recup??ration de vos donn??es ! V??rifier votre connexion ...";
            this.openSnackBar(message, 'ECM');
          });
      } else {
        //  this.route.navigate(['/connexion']);
      }
    });
  }
  //Methode pour verifier Ltoken du User et ses id
  //TODO
  VerifyTokenAndUserIdLocaleStorage(): UserECM {
    if (
      this.userAuthMongo.token != '' &&
      this.authService.user_Id_Connect != '' &&
      this.userAuthMongo.userId != ''
    ) {
      this.user_ECM.TK = this.userAuthMongo.token;
      this.user_ECM.userIdFB = this.authService.user_Id_Connect;
      this.user_ECM.userIdMG = this.userAuthMongo.userId;
      return this.user_ECM;
    }
    if (
      localStorage.getItem('ECM_TK') == null ||
      localStorage.getItem('ECM_UI_MG') == null ||
      localStorage.getItem('ECM_UI_FB') == null
    ) {
      setTimeout(() => {
        const message =
          'Vous ne disposez plus de token ! Veiller en g??n??r?? un nouveau ...';
        this.openSnackBar(message, 'ECM');
      }, 4000);
      return this.user_ECM;
    } else {
      this.user_ECM.TK = localStorage.getItem('ECM_TK');
      this.user_ECM.userIdFB = localStorage.getItem('ECM_UI_FB');
      this.user_ECM.userIdMG = localStorage.getItem('ECM_UI_MG');
      return this.user_ECM;
    }
  }
  //Methode pour ne recuperer que id FIREBASE
  //TODO
  VerifyUserIdFBLocaleStorage(): UserECM {
    if (
      this.authService.user_Id_Connect &&
      this.authService.user_Id_Connect != ''
    ) {
      this.user_ECM.userIdFB = this.authService.user_Id_Connect;
      return this.user_ECM;
    }
    if (localStorage.getItem('ECM_UI_FB') == null) {
      return this.user_ECM;
    } else {
      this.user_ECM.userIdFB = localStorage.getItem('ECM_UI_FB');
      return this.user_ECM;
    }
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
