import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { UserModel } from '../Models/user';
import { Injectable } from '@angular/core';
import { NotificationModel } from '../Models/notification';
import { Notification } from './notification.service';
@Injectable()
export class AuthService {
  constructor(private notifyService: Notification) {}
  /*
   .........................................METHODES ........................................
   */

  //Creeation d'un nouveau user...
  //TODO
  createUser(user: UserModel) {
    return new Promise<boolean | string>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.mail, user.mdp)
        .then((data_New_User) => {
          const user_Id = data_New_User.user?.uid;
          //Creation de firestore pour les informations du user
          //TODO
          firebase
            .firestore()
            .collection('user')
            .doc(user_Id)
            .set({
              nom: user.nom,
              prenom: user.prenom,
              promotion: user.promotion,
              fantome: user.fantome,
              mdp: user.mdp,
              code: user.code,
              securite: user.securite,
            })
            .then(() => {
              //Creation de la collection pour les notifications du user
              const newNotifyModel: NotificationModel = new NotificationModel(
                user_Id
              );
              this.notifyService.initNotify(newNotifyModel);
              resolve(true);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  //Authentification d'un User ...
  //TODO
  authUser(mail: string, mdp: string) {
    return new Promise<void>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, mdp)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  //ReAuthentification d'un User ...
  //TODO
  reAuthentification(mail: string, mdp: string) {
    return new Promise<void>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(mail, mdp);
      user
        ?.reauthenticateWithCredential(credentials)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  //UpdateMail
  //TODO
  updateMail(email: string, newEmail: string, mdp: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, mdp)
        .then((userCredential) => {
          userCredential.user?.updateEmail(newEmail);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  //UpdatePassword
  //TODO
  updatePassword(email: string, mdp: string, newMdp: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, mdp)
        .then((userCredential) => {
          userCredential.user?.updatePassword(newMdp);
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  //reInitialisation
  //TODO
  reInitialisation(mail: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(mail)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  //Deconnexion d'un User ...
  //TODO
  signOutUser() {
    firebase.auth().signOut();
  }

  //Delete User
  //TODO
  deleteUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user
        ?.delete()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
