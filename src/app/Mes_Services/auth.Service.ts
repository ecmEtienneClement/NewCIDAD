import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { UserModel } from '../Models/user';

import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
  /*
   .........................................METHODES ........................................
   */

  //Creeation d'un nouveau user...
  //TODO
  createUser(user: UserModel) {
    return new Promise<void>((resolve, reject) => {
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
              code: user.code,
            })
            .then(() => {
              resolve();
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

  //Deconnexion d'un User ...
  //TODO
  signOutUser() {
    firebase.auth().signOut();
  }
}
