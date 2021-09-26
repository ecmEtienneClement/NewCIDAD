import { Component, OnInit } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { EventType } from 'src/app/Models/eventAction';

@Component({
  selector: 'app-alert-dialogue-code',
  templateUrl: './alert-dialogue-code.component.html',
  styleUrls: ['./alert-dialogue-code.component.css'],
})
export class AlertDialogueCodeComponent implements OnInit {
  //Desactive le btn valider avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;

  container_verify: boolean = false;
  container_true: boolean = false;
  container_false: boolean = false;

  Id_User_Connected: string = '';
  //La valeur du code qui a etait saisis dans le champs il est initailiser car je desactive le
  //btn valider avec codeUserSaisi.length
  codeUserSaisi: any = '';
  //La valeur du code qui a etait recuperer dans la base de donne
  codeUserbd: any;
  constructor(
    private emitService: EmitEvent,
    private user: UserService,
    private gard: GardGuard
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter ...
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        this.data_Charger = true;
        this.codeUserbd = data_User.code;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });
  }

  //Methode Pour passer a la verification du code ..
  //TODO
  valider() {
    //Activation de l'animation du cercle
    this.container_verify = true;
    //Verification..
    if (this.codeUserSaisi == this.codeUserbd) {
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
    } else {
      //Attentre l'annimation avant d'emmettre
      setTimeout(() => {
        this.container_verify = false;
        this.container_false = true;
        this.emitService.emit_Event_Update_({
          type: EventType.VERIFICATION_CODE,
          data_paylode_Number: 0,
        });
      }, 2500);
    }
  }
  //Methode pour reinitialiser les valeures..
  //TODO
  reset() {
    this.codeUserSaisi = '';
    this.container_true = false;
    this.container_false = false;
  }
}
