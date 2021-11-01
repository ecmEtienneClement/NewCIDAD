import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentaireModel } from '../Models/commentaire';
import { AppPlugin } from '../Models/modelApi';
import { ErrorService } from './error.Service';
import { GardGuard } from './gard.guard';
import { Notification } from './notification.service';

@Injectable()
export class AppPlugingService implements OnInit {
  user_Id_Connect: string = '';
  nbrPluginUser: number = 0;

  private tbAppPlugin: AppPlugin[] = [];
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
    private errorNotifyService: ErrorService
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
    update: number = 0,
    tbViewUser: string[] = [],
    tbSignalCommentaire: string[] = [userId],
    tbViewCommentaire: string[] = []
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .post(environment.URL_API + '/app/plugin/', {
            language: language,
            documentation: documentation,
            code: code,
            tbCommentaire: tbCommentaire,
            userId: userId,
            date: date,
            update: update,
            tbViewUser: [],
            tbSignalCommentaire: [this.user_Id_Connect],
            tbViewCommentaire: [],
          })
          .subscribe(
            () => {
              this.notify.notifyNewPlugins();
              this.getAllPlugin();
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

  //Methode pour recuperé tout les appPlugins
  //TODO
  getAllPlugin() {
    this.http.get<AppPlugin[]>(environment.URL_API + '/app/plugin/').subscribe(
      (data_App_Plugin: AppPlugin[]) => {
        this.tbAppPlugin = data_App_Plugin;
        this.emitUpdateTbAppPlugin();
        console.log('recup db AppPluging success ...');
      },
      (error) => {
        alert(
          "Une erreur s'est produite l'or de recup ....TbAppPlugin Veiller actualisé"
        );
      }
    );
  }

  //Methode pour voir les details appPlugins d'un user
  //TODO
  getDetailsPlugin(id?: number | string): Promise<AppPlugin> {
    return new Promise((resolve, reject) => {
      this.http
        .get<AppPlugin>(environment.URL_API + '/app/plugin/details/' + id)
        .subscribe(
          (data_App_Plugin: AppPlugin) => {
            resolve(data_App_Plugin);
          },
          (error) => {
            reject(error);
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
    date: number = Date.now(),
    update: number = 1,
    tbViewUser: string[],
    tbSignalCommentaire: string[],
    tbViewCommentaire: string[],
    id?: string | number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (userId != '') {
        this.http
          .put(environment.URL_API + '/app/plugin/' + id, {
            language: language,
            documentation: documentation,
            code: code,
            tbCommentaire: tbCommentaire,
            userId: userId,
            date: date,
            update: update,
            tbViewUser: tbViewUser,
            tbSignalCommentaire: tbSignalCommentaire,
            tbViewCommentaire: tbViewCommentaire,
          })
          .subscribe(
            () => {
              this.getAllPlugin();
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
  //TODO
  updatePluginDeleteCommentaire(objPlugin: AppPlugin): Promise<boolean> {
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

      return new Promise((resolve, reject) => {
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
            })
            .subscribe(
              () => {
                this.getAllPlugin();
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
      return new Promise((resolve, reject) => {
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
            })
            .subscribe(
              () => {
                this.getAllPlugin();
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
  }
  //Methode pour supprimer plusieurs appPlugins d'un user
  //TODO
  deletePlugin(objPlugin: AppPlugin): Promise<boolean> {
    return new Promise((resolve, reject) => {
      //On verifier si cette action est bien declancher par le proprietaire du post
      let userIdRepondant = this.authService.user_Id_Connect;
      if (userIdRepondant !== objPlugin._id) {
        this.errorNotifyService.notifyActionNonPermise('cet plugin');

        reject(false);
      }
      this.http
        .delete(environment.URL_API + '/app/plugin/' + objPlugin._id)
        .subscribe(
          () => {
            this.getAllPlugin();
            resolve(true);
          },
          (error) => {
            reject(false);
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
  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
