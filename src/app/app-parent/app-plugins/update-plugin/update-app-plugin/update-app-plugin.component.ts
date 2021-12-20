import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPlugin } from 'src/app/Models/modelApi';
import { CommentaireModel } from 'src/app/Models/commentaire';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import * as moment from 'moment';
moment.locale('fr');
@Component({
  selector: 'app-update-app-plugin',
  templateUrl: './update-app-plugin.component.html',
  styleUrls: ['./update-app-plugin.component.css'],
})
export class UpdateAppPluginComponent implements OnInit {
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnEnregistre: boolean = false;
  dataCharger: boolean = false;

  idPlugin?: number;
  pluginCmp: AppPlugin = {
    _id: 0,
    language: '',
    documentation: '',
    code: '',
    tbCommentaire: [new CommentaireModel('', '', '', '', '', '')],
    userId: '',
    date: '',
    update: 0,
    tbViewUser: [],
    tbViewCommentaire: [],
    tbSignalCommentaire: [],
  };

  constructor(
    private appPluginService: AppPlugingService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private extra: ActivatedRoute,
    private errorAlertService: ErrorService
  ) {}
  ngOnInit(): void {
    //...Recuperation de l'indice via l'url
    //TODO
    this.idPlugin = this.extra.snapshot.params['idPlugin'];

    //Appelle de getDetailsPlugin
    //TODO
    this.appPluginService
      .getDetailsPlugin(this.idPlugin)
      .then((data_App_Plugin: AppPlugin) => {
        if (data_App_Plugin) {
          this.pluginCmp = data_App_Plugin;
          this.dataCharger = true;
        }
      })
      .catch(() => {
        this.errorAlertService.notifyAlertErrorDefault();
      });
  }

  /**.............................. */

  onSubmitForm(): boolean {
    this.diseableBtnEnregistre = true;
    if (
      (this.pluginCmp.language == '' || this.pluginCmp.documentation == '',
      this.pluginCmp.code == '')
    ) {
      this.diseableBtnEnregistre = false;
      this.errorAlertService.notifyAlertErrorDefault(
        'Veillez remplire tout les champs !'
      );
      return false;
    }
    let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
    this.appPluginService
      .updatePlugin(
        this.pluginCmp.language,
        this.pluginCmp.documentation,
        this.pluginCmp.code,
        this.pluginCmp.tbCommentaire,
        this.pluginCmp.userId,
        dateSaved,
        /*valeur update */ 1,
        this.pluginCmp.tbViewUser,
        this.pluginCmp.tbSignalCommentaire,
        this.pluginCmp.tbViewCommentaire,
        this.idPlugin
      )
      .then((good: boolean) => {
        if (good) {
          const message = 'Le Plugin a été bien modifié !';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          this.route.navigate(['/appPlugin']);
        }
      })
      .catch(() => {
        this.diseableBtnEnregistre = false;
      });
    return true;
  }
  //Methode pour supprimer le formulaire
  //TODO
  onResetForm() {
    this.pluginCmp.language = '';
    this.pluginCmp.documentation = '';
    this.pluginCmp.code = '';
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
