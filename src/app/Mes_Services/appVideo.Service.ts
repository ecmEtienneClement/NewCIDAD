import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppVideo } from '../Models/modelApi';
import { GardGuard } from './gard.guard';

@Injectable()
export class AppVideoService implements OnInit {
  user_Id_Connect?: string = '';
  constructor(private http: HttpClient, private authService: GardGuard) {}
  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
  }
  /**..................................................................................... */
  //Creation d'une nouvelle appVideo
  //TODO
  creatNewAppVideo(
    language: string,
    description: string,
    urlVideo: string,
    userId: string | undefined = this.user_Id_Connect
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .post(environment.URL_API + '/app/video/', {
            language: language,
            description: description,
            urlVideo: urlVideo,
            userId: userId,
          })
          .subscribe(
            () => {
              resolve(true);
            },
            (error) => {
              reject(false);
            }
          );
      } else {
        alert(
          'Veillez patienter le chargement des données puis actualisé dans 15s'
        );
      }
    });

    ///////////////////////////////////////////////////////////////////////////////
  }
  //Recuperation de toute les videos
  //TODO
  getAllAppVideo(): Promise<AppVideo[] | AppVideo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<AppVideo[] | AppVideo>(environment.URL_API + '/app/video/')
        .subscribe(
          (data_App_Video: AppVideo[] | AppVideo) => {
            resolve(data_App_Video);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  //Recuperation de toute les videos d'un User
  //TODO
  getSelectedAppVideo(userId: string): Promise<AppVideo[] | AppVideo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<AppVideo[] | AppVideo>(
          environment.URL_API + '/app/video/' + userId
        )
        .subscribe(
          (data_App_Video: AppVideo[] | AppVideo) => {
            resolve(data_App_Video);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  //Modifier une video
  //TODO
  UpdateAppVideo(
    id: string,
    language: String,
    description: String,
    urlVideo: String,
    userId: String | undefined = this.user_Id_Connect
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .put(environment.URL_API + '/app/video/' + id, {
            language: language,
            description: description,
            urlVideo: urlVideo,
            userId: userId,
          })
          .subscribe(
            () => {
              resolve(true);
            },
            (error) => {
              reject(false);
            }
          );
      } else {
        alert(
          'Veillez patienter le chargement des données puis actualisé dans 15s'
        );
      }
    });
  }
  //Supprimer une video
  //TODO
  DeletAppVideo(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.URL_API + '/app/video/' + id).subscribe(
        () => {
          resolve(true);
        },
        (error) => {
          reject(false);
        }
      );
    });
  }
}
