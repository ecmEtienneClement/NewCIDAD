import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { AppPlugin } from 'src/app/Models/modelApi';

@Component({
  selector: 'app-details-plugins',
  templateUrl: './details-plugins.component.html',
  styleUrls: ['./details-plugins.component.css'],
})
export class DetailsPluginsComponent implements OnInit {
  idPlugin?: number;
  pluginCmp: AppPlugin = {
    _id: 0,
    language: '',
    documentation: '',
    code: '',
    tbCommentaire: [],
    userId: '',
    date: 0,
  };

  language: string = this.pluginCmp.language;
  documentation: string = this.pluginCmp.documentation;
  code: string = this.pluginCmp.code;
  date: number = 0;
  tbCommentaire: string[] = this.pluginCmp.tbCommentaire;
  constructor(
    private extra: ActivatedRoute,
    private appPluginService: AppPlugingService,
    private _snackBar: MatSnackBar
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
          this.language = this.pluginCmp.language;
          this.documentation = this.pluginCmp.documentation;
          this.code = this.pluginCmp.code;
          this.date = this.pluginCmp.date;
          this.tbCommentaire = this.pluginCmp.tbCommentaire;
        }
      })
      .catch((error) => {
        const message = 'Veillez verifier votre connexion ou actualisé !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      });
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
