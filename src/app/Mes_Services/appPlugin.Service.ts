import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentaireModel } from '../Models/commentaire';
import { AppPlugin, UserECM } from '../Models/modelApi';
import { ErrorService } from './error.Service';
import { GardGuard } from './gard.guard';
import { dbNameType, LocalService } from './local.Service';
import { Notification } from './notification.service';
import { UserService } from './user.Service';
import * as moment from 'moment';
moment.locale('fr');
@Injectable()
export class AppPlugingService implements OnInit {
  user_Id_Connect: string = '';
  nbrPluginUser: number = 0;
  userEcmCmp: UserECM = {
    TK: '',
    userIdFB: '',
    userIdMG: '',
  };
  private tbAppPlugin: AppPlugin[];
  tbAppPluginSubject: Subject<AppPlugin[]> = new Subject<AppPlugin[]>();

  //Methode pour l'emmision du  tbAppPlugin
  emitUpdateTbAppPlugin() {
    this.tbAppPluginSubject.next(this.tbAppPlugin);
  }
  constructor(
    private http: HttpClient,
    private authService: GardGuard,
    private _snackBar: MatSnackBar,
    private notify: Notification,
    private errorNotifyService: ErrorService,
    private router: Router,
    private userService: UserService,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
  }
  /**..................................................................................... */
  //Methode pour creer un nouveau appPlugin
  //TODO
  creatNewAppPlugin(
    language: string,
    documentation: string,
    code: string,
    tbCommentaire: CommentaireModel[],
    userId: string | undefined = this.user_Id_Connect,
    date: number = Date.now(),
    update: number = 0
  ): Promise<boolean> {
    this.userEcmCmp.userIdMG =
      this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
    return new Promise((resolve, reject) => {
      let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
      if (userId != '') {
        this.http
          .post(environment.URL_API + '/app/plugin/', {
            language: language,
            documentation: documentation,
            code: code,
            tbCommentaire: tbCommentaire,
            userId: userId,
            date: dateSaved,
            update: update,
            tbViewUser: [],
            tbSignalCommentaire: [this.user_Id_Connect],
            tbViewCommentaire: [],
            userIdTK: this.userEcmCmp.userIdMG,
          })
          .subscribe(
            () => {
              this.notify.notifyNewPlugins();
              this.getAllPlugin();
              resolve(true);
            },
            (error) => {
              const messageError =
                "Une erreur s'est produite l'or de la publication du Plugin ! Veillez vérifier votre connexion ";
              this.errorNotifyService.notySwitchErrorStatus(
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
  //Methode pour recuperé tout les appPlugins
  //TODO
  getAllPlugin() {
    this.http.get<AppPlugin[]>(environment.URL_API + '/app/plugin/').subscribe(
      (data_App_Plugin: AppPlugin[]) => {
        this.tbAppPlugin = data_App_Plugin;
        this.emitUpdateTbAppPlugin();
        this.sauvegardeDbPluginCryptLocal();
      },
      (error) => {
        this.errorNotifyService.notySwitchErrorStatus(error.status);
      }
    );
  }
  //Methode pour voir les details appPlugins d'un user
  //TODO
  getDetailsPlugin(id?: number | string): Promise<AppPlugin> {
    return new Promise((resolve) => {
      this.http
        .get<AppPlugin>(environment.URL_API + '/app/plugin/details/' + id)
        .subscribe(
          (data_App_Plugin: AppPlugin) => {
            resolve(data_App_Plugin);
          },
          (error) => {
            //Traitement des erreurs
            this.errorNotifyService.notySwitchErrorStatus(
              error.status,
              'Plugin'
            );
            this.router.navigate(['/appPlugin']);
          }
        );
    });
  }
  //Methode pour modifier appPlugins d'un user
  //TODO
  updatePlugin(
    language: string,
    documentation: string,
    code: string,
    tbCommentaire: CommentaireModel[],
    userId: string | undefined = this.user_Id_Connect,
    date: string = '',
    update: number = 1,
    tbViewUser: string[],
    tbSignalCommentaire: string[],
    tbViewCommentaire: string[],
    id?: string | number
  ): Promise<boolean> {
    this.userEcmCmp.userIdMG =
      this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
    return new Promise((resolve) => {
      let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
      if (userId != '') {
        this.http
          .put(environment.URL_API + '/app/plugin/' + id, {
            language: language,
            documentation: documentation,
            code: code,
            tbCommentaire: tbCommentaire,
            userId: userId,
            date: dateSaved,
            update: update,
            tbViewUser: tbViewUser,
            tbSignalCommentaire: tbSignalCommentaire,
            tbViewCommentaire: tbViewCommentaire,
            userIdTK: this.userEcmCmp.userIdMG,
          })
          .subscribe(
            () => {
              this.getAllPlugin();
              resolve(true);
            },
            (error) => {
              this.errorNotifyService.notySwitchErrorStatus(error.status);
              resolve(false);
            }
          );
      } else {
        alert(
          'Veillez patienter le chargement des données puis actualisé dans 15s'
        );
      }
    });
  }
  //TODO
  updatePluginDeleteCommentaire(objPlugin: AppPlugin): Promise<boolean> {
    this.userEcmCmp.userIdMG =
      this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
    return new Promise((resolve, reject) => {
      this.http
        .put(environment.URL_API + '/app/plugin/' + objPlugin._id, {
          language: objPlugin.language,
          documentation: objPlugin.documentation,
          code: objPlugin.code,
          tbCommentaire: objPlugin.tbCommentaire,
          userId: objPlugin.userId,
          date: objPlugin.date,
          update: objPlugin.update,
          tbViewUser: objPlugin.tbViewUser,
          tbSignalCommentaire: objPlugin.tbSignalCommentaire,
          tbViewCommentaire: objPlugin.tbViewCommentaire,
          userIdTK: this.userEcmCmp.userIdMG,
        })
        .subscribe(
          () => {
            resolve(true);
          },
          (error) => {
            reject(false);
          }
        );
    });
  }
  //Methode pour la verification si le user est l'auteur de cet plugin
  //TODO
  async verifyUserUpdatePlugin(
    id_Plugin: any,
    id_User_Plugin: string
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      if (this.tbAppPlugin) {
        let trouver: boolean = false;
        let valide: boolean = false;
        for (let index = 0; index < this.tbAppPlugin.length; index++) {
          const element = this.tbAppPlugin[index];
          if (element._id == id_Plugin) {
            trouver = true;
            if (element.userId == id_User_Plugin) {
              valide = true;
              return resolve(true);
            } else {
              alert(
                'Attention ! Cet plugin que vous tentez de modifié ne vous appartient pas !'
              );
              this.router.navigate(['/appPlugin']);
              return reject(false);
            }
          }
        }

        if (!trouver) {
          this.errorNotifyService.notifyAlertErrorDefault(
            "Cet plugin n'existe pas !"
          );

          this.router.navigate(['/appPlugin']);
          return reject(false);
        }
        if (!valide) {
          return reject(false);
        }
        return;
      } else {
        this.getDetailsPlugin(id_Plugin)
          .then((dataPlugin) => {
            if (dataPlugin.userId != id_User_Plugin) {
              alert(
                'Attention ! Cet plugin que vous tentez de modifié ne vous appartient pas !'
              );
              return reject(false);
            }
            resolve(true);
          })
          .catch(() => {
            this.errorNotifyService.notifyAlertErrorDefault();
            return reject(false);
          });
      }
    });
  }
  //...Partie de la suppression ou reinitialisation compte du User
  //TODO
  DeleteCommentairePluginUserDeleteAndReiniCompte(
    id_User: string
  ): Promise<number> {
    let nbrCommentaire: number = 0;
    let tbFilterCommentaire: CommentaireModel[] = [];
    return new Promise((resolve, reject) => {
      try {
        this.tbAppPlugin.forEach((element) => {
          tbFilterCommentaire =
            element.tbCommentaire.filter(
              (element) => element.Id_User != id_User
            ).length != 0
              ? element.tbCommentaire.filter(
                  (element) => element.Id_User != id_User
                )
              : [];
          nbrCommentaire +=
            element.tbCommentaire.length - tbFilterCommentaire.length;
          element.tbCommentaire = tbFilterCommentaire;
          //Update de l'element avant de passer a un autre
          this.updatePluginDeleteCommentaire(element)
            .then(() => {})
            .catch(() => reject(-1));
          //Netoyage du tb avant de passer a un autre element
          tbFilterCommentaire = [];
        });
        this.getAllPlugin();
        resolve(nbrCommentaire);
      } catch (error) {
        reject(-1);
      }
    });
  }
  //Methode pour marque que le user a vue ce plugin.
  //TODO
  addViewPlugin(
    objPlugin: AppPlugin,
    user_Id_Connect: string
  ): Promise<boolean> | number {
    if (objPlugin.tbViewUser.includes(user_Id_Connect)) {
      return 0;
    } else {
      objPlugin.tbViewUser.push(user_Id_Connect);
      this.userEcmCmp.userIdMG =
        this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
      return new Promise((resolve) => {
        if (objPlugin.userId != '') {
          this.http
            .put(environment.URL_API + '/app/plugin/' + objPlugin._id, {
              language: objPlugin.language,
              documentation: objPlugin.documentation,
              code: objPlugin.code,
              tbCommentaire: objPlugin.tbCommentaire,
              userId: objPlugin.userId,
              date: objPlugin.date,
              update: objPlugin.update,
              tbViewUser: objPlugin.tbViewUser,
              tbSignalCommentaire: objPlugin.tbSignalCommentaire,
              tbViewCommentaire: objPlugin.tbViewCommentaire,
              userIdTk: this.userEcmCmp.userIdMG,
            })
            .subscribe(
              () => {
                this.getAllPlugin();
                resolve(true);
              },
              (error) => {
                this.errorNotifyService.notySwitchErrorStatus(error.status);
              }
            );
        } else {
          alert(
            'Veillez patienter le chargement des données puis actualisé dans 15s'
          );
        }
      });
    }
  }
  //Methode pour marque que le user a vue ce commentaire.
  //TODO
  addViewCommentairePlugin(
    objPlugin: AppPlugin,
    user_Id_Connect: string
  ): Promise<boolean> | number {
    if (
      !objPlugin.tbSignalCommentaire.includes(user_Id_Connect) ||
      objPlugin.tbViewCommentaire.includes(user_Id_Connect)
    ) {
      return 0;
    } else {
      objPlugin.tbViewCommentaire.push(user_Id_Connect);
      objPlugin.tbViewUser.push(user_Id_Connect);
      this.userEcmCmp.userIdMG =
        this.userService.VerifyTokenAndUserIdLocaleStorage().userIdMG;
      return new Promise((resolve) => {
        if (objPlugin.userId != '') {
          this.http
            .put(environment.URL_API + '/app/plugin/' + objPlugin._id, {
              language: objPlugin.language,
              documentation: objPlugin.documentation,
              code: objPlugin.code,
              tbCommentaire: objPlugin.tbCommentaire,
              userId: objPlugin.userId,
              date: objPlugin.date,
              update: objPlugin.update,
              tbViewUser: objPlugin.tbViewUser,
              tbSignalCommentaire: objPlugin.tbSignalCommentaire,
              tbViewCommentaire: objPlugin.tbViewCommentaire,
              userIdTk: this.userEcmCmp.userIdMG,
            })
            .subscribe(
              () => {
                this.getAllPlugin();
                resolve(true);
              },
              (error) => {
                this.errorNotifyService.notySwitchErrorStatus(error.status);
              }
            );
        } else {
          alert(
            'Veillez patienter le chargement des données puis actualisé dans 15s'
          );
        }
      });
    }
  }
  //Methode pour supprimer plusieurs appPlugins d'un user
  //TODO
  deletePlugin(objPlugin: AppPlugin): Promise<boolean> {
    return new Promise((resolve) => {
      this.http
        .delete(environment.URL_API + '/app/plugin/' + objPlugin._id)
        .subscribe(
          () => {
            this.getAllPlugin();
            resolve(true);
          },
          (error) => {
            this.errorNotifyService.notySwitchErrorStatus(error.status);
          }
        );
    });
  }
  //Methode pour connaitre le nbr de plugin du user qu'on a supprimer
  //TODO
  getNbrPluginUser(user_Id: string): number {
    let tbAppPluginSearh =
      this.tbAppPlugin.filter((plugin) => plugin.userId == user_Id).length !== 0
        ? this.tbAppPlugin.filter((plugin) => plugin.userId == user_Id)
        : [];
    return tbAppPluginSearh.length;
  }
  //tbPlugin
  //Methode pour supprimer plusieurs appPlugins d'un user
  //TODO
  deleteManyPlugin(user_Id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(environment.URL_API + '/app/plugin/many/' + user_Id)
        .subscribe(
          () => {
            this.getAllPlugin();
            resolve(this.getNbrPluginUser(user_Id));
          },
          (error) => {
            reject(-1);
          }
        );
    });
  }

  //Methode pour crypter et sauvegarder les donnees en local
  //TODO
  sauvegardeDbPluginCryptLocal(): boolean {
    let pourcentageTb: number = 0;
    //Verification du modeLocal du User
    const modeLocalUserConnected: boolean | number =
      this.localService.verifyModeLocal();
    if (modeLocalUserConnected == true) {
      //Verification si la BD AppPlugin est activer
      const chekedBdPlugin: boolean | number =
        this.localService.VerifyAppPlugin();
      if (chekedBdPlugin == true) {
        //Verifie si le tb est different de undifi
        if (this.tbAppPlugin) {
          //recuperation du pourcentage
          let pourcentage =
            this.localService.getPoucentageDonneLocal('ECM_PB_P');
          //arret du processus si le pourcentage est egal a 0
          if (pourcentage == 0) {
            this.errorNotifyService.notifyAlertErrorDefault(
              "Mode local activer, mais pourcentage de sauvegarde de base non défini ! Veiller reconfiguré l'environnement local "
            );
            return false;
          }
          //cas ou le pourcentage est de 75%
          if (pourcentage == 3) {
            pourcentageTb = Math.floor(this.tbAppPlugin.length / 4) * 3;
          } else {
            //Arrondi la valeur pour ne op avoir des virgules
            pourcentageTb = Math.floor(this.tbAppPlugin.length / pourcentage);
          }

          let i: number = 0;
          //Debut de la sauvegarde
          for (let index = 0; index < pourcentageTb; index++) {
            const elementBug = this.tbAppPlugin[index];
            //ECM_Local
            let name: string = 'ECM_BP_' + i;
            localStorage.setItem(name, window.btoa(JSON.stringify(elementBug)));
            ++i;
          }
          //Enregistrement de la date de sauvegarde
          this.localService.dataSavedDonneLocal(dbNameType.PLUGIN);
          return true;
        } else {
          this.errorNotifyService.notifyAlertErrorDefault(
            "Bd App-Plugin n'est pas chargée ! Veillez actualiser pour recharger la BD distante ou vérifier votre connexion ..."
          );
        }
      }
    }
    return false;
  }
  //Methode pour recuperer les donnees en local
  //TODO
  recupDbPluginCryptLocal(): boolean {
    //Verification du modeLocal du User
    const mode_Local_User_Connected = this.localService.verifyModeLocal();
    if (mode_Local_User_Connected == true) {
      //Verification si la BD AppPlugin est activer
      const chekedBdPlugin: boolean | number =
        this.localService.VerifyAppPlugin();
      if (chekedBdPlugin == true) {
        //Verification preliminaire de l'existance de la bd
        const bdBugCrypt: any = localStorage.getItem('ECM_BP_0');
        if (bdBugCrypt == null) {
          this.errorNotifyService.notifyAlertErrorDefault(
            "Désoler ! Nous n'avons pas trouvé de données local sur les Plugins ! Veiller reconfiguré l'environnement local "
          );
          return false;
        }
        //Recuperation de la base
        let tbPostLocal: AppPlugin[] = [];
        for (let i = 0; i < 0; ++i) {
          let name: string = 'ECM_BP_' + i;
          let element: any = localStorage.getItem(name);
          if (element == null) {
            this.tbAppPlugin = tbPostLocal;
            this.emitUpdateTbAppPlugin();
            return true;
          }
          const elementDecrypt: string = window.atob(element);
          const elementDecryptParseJson: any = JSON.parse(elementDecrypt);
          tbPostLocal.push(elementDecryptParseJson);
        }
      }
    }
    return false;
  }
  //Methode pour le nombre d'elements sauvegardé les donnees en local
  //TODO
  nbrElementDbPluginCryptLocal(): number {
    //Verification preliminaire de l'existance de la bd
    let nbrElement: number = 0;
    if (localStorage.getItem('ECM_BP_0') == null) {
      return 0;
    }

    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BP_' + i;
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
  deleteDbPluginCryptLocal(silence: boolean): boolean {
    //Verification preliminaire de l'existance de la bd
    if (localStorage.getItem('ECM_BP_0') == null) {
      if (!silence) {
        this.errorNotifyService.notifyAlertErrorDefault(
          "Nous n'avons pas trouvé de données local a supprimées sur les Plugins ! "
        );
      }
      return false;
    }

    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BP_' + i;
      let element: any = localStorage.getItem(name);
      if (element != null) {
        localStorage.removeItem(name);
      }
      if (element == null) {
        if (!silence) {
          this.errorNotifyService.notifyAlertErrorDefault(
            'Données local des Plugins supprimées ! '
          );
        }
        return true;
      }
    }

    return false;
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
