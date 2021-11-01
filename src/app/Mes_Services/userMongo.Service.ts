import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { UserMongo } from '../Models/modelApi';
@Injectable()
export class UserMoogoService {
  constructor(private http: HttpClient) {}

  //Methode pour creer un new user Moogo
  //TODO
  creatNewUser(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, rejects) => {
      this.http
        .post(environment.URL_API + '/user/signup/', {
          email: email,
          password: password,
        })
        .subscribe(
          () => {
            resolve(true);
          },
          (error) => {
            rejects(false);
          }
        );
    });
  }
  //Methode pour connecter un user Moogo
  //TODO
  connectUserMoogo(email: string, password: string): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.http
        .post(environment.URL_API + '/user/login/', {
          email: email,
          password: password,
        })
        .subscribe(
          (data_Token) => {
            resolve(data_Token);
          },
          (error) => {
            rejects(false);
          }
        );
    });
  }
  //Methode pour chercher un user Moogo
  //TODO
  getUserMongo(email: string | null): Promise<UserMongo> {
    return new Promise((resolve, rejects) => {
      this.http
        .get<UserMongo>(environment.URL_API + '/user/getuser/' + email)
        .subscribe(
          (data_User: UserMongo) => {
            resolve(data_User);
          },
          (error) => {
            rejects(error);
          }
        );
    });
  }
  //Methode pour modifier le email user Moogo
  //TODO
  updateMailUserMongo(
    newEmail: string,
    password: string,
    id?: number
  ): Promise<boolean | string> {
    return new Promise((resolve, rejects) => {
      this.http
        .put(environment.URL_API + '/user/update/email/' + id, {
          email: newEmail,
          password: password,
        })
        .subscribe(
          () => {
            resolve(true);
          },
          (error) => {
            rejects(error);
          }
        );
    });
  }
  //Methode pour modifier le mdp user Moogo
  //TODO
  updateMdpUserMongo(
    email: string,
    newPassword: string,
    id?: number | string
  ): Promise<boolean | string> {
    return new Promise((resolve, rejects) => {
      this.http
        .put(environment.URL_API + '/user/update/password/' + id, {
          email: email,
          password: newPassword,
        })
        .subscribe(
          () => {
            resolve(true);
          },
          (error) => {
            rejects(error);
          }
        );
    });
  }

  //Methode pour supprimer le user Moogo
  //TODO
  deletUserMongo(_id: string): Promise<boolean> {
    return new Promise((resolve, rejects) => {
      this.http.delete(environment.URL_API + '/user/delete/' + _id).subscribe(
        () => {
          resolve(true);
        },
        (error) => {
          rejects(false);
        }
      );
    });
  }
}
