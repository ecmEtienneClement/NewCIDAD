import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { UserMongo } from '../Models/modelApi';
import { ErrorService } from './error.Service';
@Injectable()
export class UserMoogoService {
  token: string = '';
  userId: string = '';
  constructor(
    private http: HttpClient,
    private alertErrorService: ErrorService
  ) {}

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
  
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.URL_API + '/user/login/', {
          email: email,
          password: password,
        })
        .subscribe(
          (data_Token_And_UserId: any) => {
            this.userId = data_Token_And_UserId.userId;
            this.token = data_Token_And_UserId.token;
            localStorage.setItem('ECM_TK', this.token);
            localStorage.setItem('ECM_UI_MG', this.userId);
            resolve(data_Token_And_UserId);
          },
          (error) => {
            this.alertErrorService.notySwitchErrorStatus(
              error.status,
              'Utilisateur'
            );
            reject(false);
          }
        );
    });
  }
  //Methode pour chercher un user Moogo
  //TODO
  getUserMongo(email: any): Promise<UserMongo> {
    return new Promise((resolve) => {
      this.http
        .get<UserMongo>(environment.URL_API + '/user/getuser/' + email)
        .subscribe(
          (data_User: UserMongo) => {
            resolve(data_User);
          },
          () => {
            this.alertErrorService.notifyAlertErrorDefault();
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
            this.alertErrorService.notySwitchErrorStatus(error.status);
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
    return new Promise((resolve) => {
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
            this.alertErrorService.notySwitchErrorStatus(error.status);
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
