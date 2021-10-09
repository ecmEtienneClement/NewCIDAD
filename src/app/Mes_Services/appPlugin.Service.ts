import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppPlugin } from '../Models/modelApi';
import { GardGuard } from './gard.guard';

@Injectable()
export class AppPlugingService implements OnInit {
  user_Id_Connect?: string = '';
  private tbAppPlugin: AppPlugin[] = [];
  tbAppPluginSubject: Subject<AppPlugin[]> = new Subject<AppPlugin[]>();

  //Methode pour l'emmision du  tbAppPlugin
  emitUpdateTbAppPlugin() {
    this.tbAppPluginSubject.next(this.tbAppPlugin);
  }
  constructor(private http: HttpClient, private authService: GardGuard) {}
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
    tbCommentaire: Array<string>,
    userId: string | undefined = this.user_Id_Connect,
    date: number = Date.now()
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

  //Methode pour recuperé tout les appPlugins d'un user
  //TODO
  getSelectedPlugin(user_Id?: string): Promise<AppPlugin[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<AppPlugin[]>(environment.URL_API + '/app/plugin/' + user_Id)
        .subscribe(
          (data_App_Plugin: AppPlugin[]) => {
            resolve(data_App_Plugin);
          },
          (error) => {
            reject(error);
          }
        );
    });
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
    tbCommentaire: Array<string>,
    userId: string | undefined = this.user_Id_Connect,
    date: number = Date.now(),
    id?: string|number
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

  //Methode pour supprimer appPlugins d'un user
  //TODO
  deletePlugin(id?: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.URL_API + '/app/plugin/' + id).subscribe(
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
}
