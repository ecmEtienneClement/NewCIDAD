import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPlugin } from 'src/app/Models/modelApi';
import { CommentaireModel } from 'src/app/Models/commentaire';

@Component({
  selector: 'app-update-app-plugin',
  templateUrl: './update-app-plugin.component.html',
  styleUrls: ['./update-app-plugin.component.css'],
})
export class UpdateAppPluginComponent implements OnInit {
  myForm: FormGroup;
  idPlugin?: number;
  pluginCmp: AppPlugin = {
    _id: 0,
    language: '',
    documentation: '',
    code: '',
    tbCommentaire: [new CommentaireModel('', '', '', '', '', 0)],
    userId: '',
    date: 0,
    update: 0,
    tbViewUser: [],
    tbViewCommentaire: [],
    tbSignalCommentaire: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private appPluginService: AppPlugingService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private extra: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initForm();

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
        }
      })
      .catch((error) => {
        const message = 'Veillez verifier votre connexion ou actualisé !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      });
  }

  /**.............................. */

  initForm() {
    this.myForm = this.formBuilder.group({
      language: ['', Validators.required],
      documentation: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmitForm() {
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let documentation = valueForm['documentation'];
    let code = valueForm['code'];

    this.appPluginService
      .updatePlugin(
        language,
        documentation,
        code,
        this.pluginCmp.tbCommentaire,
        this.pluginCmp.userId,
        Date.now(),
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
      .catch((noGood) => {
        if (!noGood) {
          const message = 'Veillez verifier votre connexion ou actualisé !';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
        }
      });
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
