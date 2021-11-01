import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppVideo } from '../Models/modelApi';
import { ErrorService } from './error.Service';
import { GardGuard } from './gard.guard';

@Injectable()
export class AppVideoService implements OnInit {
  user_Id_Connect: string = '';
  nbrVideosUser: number = 0;
  private tbAppVideo: AppVideo[] = [];
  tbAppVideoSubject: Subject<AppVideo[]> = new Subject<AppVideo[]>();
  //
  donneeCharger: boolean = false;
  errorDonneeCharger: boolean = false;
  //Methode pour l'emmision du  tbAppVideo
  emitUpdatetbAppVideo() {
    this.tbAppVideoSubject.next(this.tbAppVideo);
    //Attendre 2 secondes pour ne pas bloquer le next
    if (this.errorDonneeCharger) {
      setTimeout(() => {
        this.tbAppVideoSubject.error(new Error());
      }, 2000);
    }
    /*
    if (this.donneeCharger) {
      setTimeout(() => {
        this.tbAppVideoSubject.complete();
      }, 2000);
    }
    */
  }

  constructor(
    private http: HttpClient,
    private authService: GardGuard,
    private alertErrorService: ErrorService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
  }
  /**..................................................................................... */
  //Methode pour creer un nouveau AppVideo
  //TODO
  creatNewAppVideo(
    userId: string = this.user_Id_Connect,
    cour: string,
    titre: string,
    url: string,
    signaler: string[],
    viewUser: string[],
    date: number = Date.now()
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .post(environment.URL_API + '/app/video/', {
            userId: userId,
            cour: cour,
            titre: titre,
            url: url,
            signaler: signaler,
            viewUser: viewUser,
            date: date,
          })
          .subscribe(
            () => {
              this.getAllVideo();
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

  //Methode pour recuperé tout les AppVideos
  //TODO
  getAllVideo() {
    this.http.get<AppVideo[]>(environment.URL_API + '/app/video/').subscribe(
      (data_App_Video: AppVideo[]) => {
        this.tbAppVideo = data_App_Video;
        this.emitUpdatetbAppVideo();
        console.log('recup db AppVideog success ...');
      },
      (error) => {
        this.errorDonneeCharger = true;
        this.emitUpdatetbAppVideo();
      },
      () => {
        // this.donneeCharger = true;
        // this.emitUpdatetbAppVideo();
      }
    );
  }
  //Methode pour modifier AppVideos d'un user
  //TODO
  updateVideo(
    userId: string,
    cour: string,
    titre: string,
    url: string,
    signaler: string[],
    viewUser: string[],
    date: number,
    id: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .put(environment.URL_API + '/app/video/' + id, {
            userId: userId,
            cour: cour,
            titre: titre,
            url: url,
            signaler: signaler,
            viewUser: viewUser,
            date: date,
          })
          .subscribe(
            () => {
              this.getAllVideo();
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
  //Methode pour supprimer plusieurs AppVideos d'un user
  //TODO
  deleteVideo(objAppVideo: AppVideo): Promise<boolean> {
    let userIdRepondant = this.authService.user_Id_Connect;

    return new Promise((resolve, reject) => {
      if (userIdRepondant !== objAppVideo.userId) {
        this.alertErrorService.notifyActionNonPermise('cet URL');
        reject(false);
      }
      this.http
        .delete(environment.URL_API + '/app/video/' + objAppVideo._id)
        .subscribe(
          () => {
            this.getAllVideo();
            resolve(true);
          },
          (error) => {
            reject(false);
          }
        );
    });
  }
  //Methode pour connaitre le nbr de Video du user qu'on a supprimer
  //TODO
  getNbrVideoUser(user_Id: string): number {
    let tbAppVideoSearh =
      this.tbAppVideo.filter((Video) => Video.userId == user_Id).length !== 0
        ? this.tbAppVideo.filter((Video) => Video.userId == user_Id)
        : [];
    return tbAppVideoSearh.length;
  }
  //Methode pour supprimer plusieurs AppVideos d'un user
  //TODO
  deleteManyVideo(user_Id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(environment.URL_API + '/app/video/many/' + user_Id)
        .subscribe(
          () => {
            this.getAllVideo();
            resolve(this.getNbrVideoUser(user_Id));
          },
          (error) => {
            reject(-1);
          }
        );
    });
  }
}
