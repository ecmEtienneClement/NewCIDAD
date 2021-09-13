import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Injectable } from '@angular/core';
@Injectable()
export class UserService {
  //Recuperation des Informations du  User
  //TODO
  getInfoUser(Id_User: any): Promise<any> {
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
}
