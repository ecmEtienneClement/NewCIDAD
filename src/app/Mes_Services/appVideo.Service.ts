import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppVideo, UserECM } from '../Models/modelApi';
import { ErrorService } from './error.Service';
import { GardGuard } from './gard.guard';
import { dbNameType, LocalService } from './local.Service';
import { UserService } from './user.Service';
import * as moment from 'moment';
moment.locale('fr');
@Injectable()
export class AppVideoService implements OnInit {
  userEcmCmp: UserECM = {
    TK: '',
    userIdFB: '',
    userIdMG: '',
  };
  user_Id_Connect: string = '';
  nbrVideosUser: number = 0;
  private tbAppVideo: AppVideo[];
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
  }

  constructor(
    private http: HttpClient,
    private authService: GardGuard,
    private alertErrorService: ErrorService,
    private userService: UserService,
    private localService: LocalService
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
    viewUser: string[]
  ): Promise<boolean> {
    this.userEcmCmp.userIdMG =
      this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
    return new Promise((resolve, reject) => {
      if (userId != '') {
        let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
        this.http
          .post(environment.URL_API + '/app/video/', {
            userId: userId,
            cour: cour,
            titre: titre,
            url: url,
            signaler: signaler,
            viewUser: viewUser,
            date: dateSaved,
            userIdTK: this.userEcmCmp.userIdMG,
          })
          .subscribe(
            () => {
              this.getAllVideo();
              resolve(true);
            },
            (error) => {
              const messageError =
                "Une erreur s'est produite l'or de la publication du URL de la video ! Veillez vérifier votre connexion ";
              this.alertErrorService.notySwitchErrorStatus(
                error.status,
                '',
                messageError
              );
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
        this.sauvegardeDbVideoCryptLocal();
        console.log('recup db AppVideog success ...');
      },
      (error) => {
        this.alertErrorService.notySwitchErrorStatus(error.status);
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
    this.userEcmCmp.userIdMG =
      this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
    return new Promise((resolve) => {
      if (userId != '') {
        let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
        this.http
          .put(environment.URL_API + '/app/video/' + id, {
            userId: userId,
            cour: cour,
            titre: titre,
            url: url,
            signaler: signaler,
            viewUser: viewUser,
            date: dateSaved,
            userIdTK: this.userEcmCmp.userIdMG,
          })
          .subscribe(
            () => {
              this.getAllVideo();
              resolve(true);
            },
            (error) => {
              this.alertErrorService.notySwitchErrorStatus(error.status);
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
            this.alertErrorService.notySwitchErrorStatus(error.status);
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

  //Methode pour crypter et sauvegarder les donnees en local
  //TODO
  sauvegardeDbVideoCryptLocal(): boolean {
    let pourcentageTb: number = 0;
    //Verification du modeLocal du User
    const modeLocalUserConnected: boolean | number =
      this.localService.verifyModeLocal();
    if (modeLocalUserConnected == true) {
      //Verification le BD AppVideo est activer
      const checkdedVideo: boolean | number =
        this.localService.VerifyAppVideo();
      if (checkdedVideo == true) {
        //Verifie si le tb est different de undif..
        if (this.tbAppVideo) {
          //recuperation du pourcentage

          let pourcentage =
            this.localService.getPoucentageDonneLocal('ECM_PB_V');
          //arret du processus si le pourcentage est egal a 0

          if (pourcentage == 0) {
            this.alertErrorService.notifyAlertErrorDefault(
              "Mode local activer, mais pourcentage de sauvegarde de base non défini ! Veiller reconfiguré l'environnement local "
            );
            return false;
          }
          //cas ou le pourcentage est de 75%
          if (pourcentage == 3) {
            pourcentageTb = Math.ceil(this.tbAppVideo.length / 4) * 3;
          } else {
            //Arrondi la valeur pour ne op avoir des virgules
            pourcentageTb = Math.ceil(this.tbAppVideo.length / pourcentage);
          }

          let i: number = 0;
          //Debut de la sauvegarde
          for (let index = 0; index < pourcentageTb; index++) {
            const elementBug = this.tbAppVideo[index];
            //ECM_Local
            let name: string = 'ECM_BV_' + i;
            localStorage.setItem(name, window.btoa(JSON.stringify(elementBug)));
            ++i;
          }
          //Enregistrement de la date de sauvegarde
          this.localService.dataSavedDonneLocal(dbNameType.VIDEO);
          return true;
        } else {
          this.alertErrorService.notifyAlertErrorDefault(
            "Bd App-URL-Video n'est pas chargée ! Veillez actualiser pour recharger la BD distante ou vérifier votre connexion ..."
          );
        }
      }
    }
    return false;
  }
  //Methode pour recuperer les donnees en local
  //TODO
  recupDbVideoCryptLocal(): boolean {
    //Verification du modeLocal du User
    const mode_Local_User_Connected = this.localService.verifyModeLocal();
    if (mode_Local_User_Connected == true) {
      const checkdedVideo: boolean | number =
        this.localService.VerifyAppVideo();
      if (checkdedVideo == true) {
        //Verification preliminaire de l'existance de la bd
        const bdBugCrypt: any = localStorage.getItem('ECM_BV_0');
        if (bdBugCrypt == null) {
          this.alertErrorService.notifyAlertErrorDefault(
            "Désoler ! Nous n'avons pas trouvé de données local sur les URL_Videos ! Veiller reconfiguré l'environnement local "
          );
          return false;
        }
        //Recuperation de la base
        let tbAppVideoLocal: AppVideo[] = [];
        for (let i = 0; i < 0; ++i) {
          let name: string = 'ECM_BV_' + i;
          let element: any = localStorage.getItem(name);
          if (element == null) {
            this.tbAppVideo = tbAppVideoLocal;
            this.emitUpdatetbAppVideo();
            return true;
          }
          const elementDecrypt: string = window.atob(element);
          const elementDecryptParseJson: any = JSON.parse(elementDecrypt);
          tbAppVideoLocal.push(elementDecryptParseJson);
        }
      }
    }
    return false;
  }
  //Methode pour le nombre d'elements sauvegardé les donnees en local
  //TODO
  nbrElementDbBugCryptLocal(): number {
    //Verification preliminaire de l'existance de la bd
    let nbrElement: number = 0;
    if (localStorage.getItem('ECM_BV_0') == null) {
      return 0;
    }
    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BV_' + i;
      let element: any = localStorage.getItem(name);
      if (element != null) {
        nbrElement += 1;
      }
      if (element == null) {
        return nbrElement;
      }
    }

    return nbrElement;
  }
  //Methode pour supprimer les donnees en local
  //TODO
  deleteDbVideoCryptLocal(silence: boolean): boolean {
    //Verification preliminaire de l'existance de la bd
    if (localStorage.getItem('ECM_BV_0') == null) {
      if (!silence) {
        this.alertErrorService.notifyAlertErrorDefault(
          "Nous n'avons pas trouvé de données local a supprimées sur les URL_Videos ! "
        );
      }
      return false;
    }

    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BV_' + i;
      let element: any = localStorage.getItem(name);
      if (element != null) {
        localStorage.removeItem(name);
      }
      if (element == null) {
        if (!silence) {
          this.alertErrorService.notifyAlertErrorDefault(
            'Données local des URL_Videos supprimées ! '
          );
        }
        return true;
      }
    }

    return false;
  }
}
