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
  myForm: FormGroup;
  user_Id_Connect?: string = '';
  options: string[] = [
    'Java',
    'JavaScript',
    'Python',
    'C',
    'C++',
    'C#',
    'Ruby',
    'PHP',
    'Objective-C',
    'CSS',
    'CSS 3',
    'ECMAScript',
    'JSP',
    'VBA',
    'HTML',
    'TypeScript',
  ];

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
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let documentation = valueForm['documentation'];
    let code = valueForm['code'];
    this.appPluginService
      .creatNewAppPlugin(
        language,
        documentation,
        code,
        new Array<string>(),
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
      })
      .catch((noGood) => {
        if (!noGood) {
          const message =
            "Une erreur s'est produite l'or de la publication du Plugin !";
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
