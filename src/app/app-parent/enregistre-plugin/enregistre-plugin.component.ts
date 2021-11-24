import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';

@Component({
  selector: 'app-enregistre-plugin',
  templateUrl: './enregistre-plugin.component.html',
  styleUrls: ['./enregistre-plugin.component.css'],
})
export class EnregistrePluginComponent implements OnInit {
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnEnregistre: boolean = false;

  myForm: FormGroup;
  user_Id_Connect: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private appPluginService: AppPlugingService,
    private authService: GardGuard,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {}
  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      language: ['', Validators.required],
      documentation: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmitForm() {
    this.diseableBtnEnregistre = true;
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let documentation = valueForm['documentation'];
    let code = valueForm['code'];
    this.appPluginService
      .creatNewAppPlugin(
        language,
        documentation,
        code,
        [],
        this.user_Id_Connect,
        Date.now()
      )
      .then((good: boolean) => {
        if (good) {
          const message = 'Le Plugin a été bien publié !';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          this.route.navigate(['appPlugin']);
        }
      }).catch(
        ()=>{
          this.diseableBtnEnregistre = false;
        }
      );
      
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
