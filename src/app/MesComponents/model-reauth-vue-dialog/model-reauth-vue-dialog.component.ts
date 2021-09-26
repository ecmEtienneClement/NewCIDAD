import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { EventType } from 'src/app/Models/eventAction';

@Component({
  selector: 'app-model-reauth-vue-dialog',
  templateUrl: './model-reauth-vue-dialog.component.html',
  styleUrls: ['./model-reauth-vue-dialog.component.css'],
})
export class ModelReauthVueDialogComponent implements OnInit {
  myForm: FormGroup;

  container_verify: boolean = false;
  container_true: boolean = false;
  container_false: boolean = false;

  user_Email_Connect: string | null;
  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private gard: GardGuard,
    private emitService: EmitEvent
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.user_Email_Connect = this.gard.user_Email_Connect;
    //Initialisation du formulaire
    //TODO
    this.initForm();
  }

  //Methode d'initialisation du formulaire
  //TODO
  initForm() {
    this.myForm = this.formBuilder.group({
      mail: [this.user_Email_Connect, [Validators.required, Validators.email]],
      mdp: ['', Validators.required],
    });
  }
  //Methhode de soumission du formulaire
  //TODO
  onSubmitMyForm() {
    const mail = this.myForm.value['mail'];
    const mdp = this.myForm.value['mdp'];
    //Activation de l'animation du cercle
    this.container_verify = true;
    //Appelle de la methode de reaut...
    this.authService
      .reAuthentification(mail, mdp)
      .then(() => {
        //Attentre l'annimation l'animation des lignes
        setTimeout(() => {
          this.container_true = true;
        }, 2500);
        //Attentre l'annimation .avant d'emmettre
        setTimeout(() => {
          this.emitService.emit_Event_Update_({
            type: EventType.VERIFICATION_CODE,
            data_paylode_Number: 1,
          });
        }, 3000);
      })
      .catch((erreur) => {
        //Attentre l'annimation avant d'emmettre
        setTimeout(() => {
          this.container_verify = false;
          this.container_false = true;
          this.emitService.emit_Event_Update_({
            type: EventType.VERIFICATION_CODE,
            data_paylode_Number: 0,
          });
        }, 2500);
      });
  }
}
