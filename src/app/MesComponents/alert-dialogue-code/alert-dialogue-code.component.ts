import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { EventType } from 'src/app/Models/eventAction';
import gsap from 'gsap';

import { ErrorService } from 'src/app/Mes_Services/error.Service';

import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-alert-dialogue-code',
  templateUrl: './alert-dialogue-code.component.html',
  styleUrls: ['./alert-dialogue-code.component.css'],
})
export class AlertDialogueCodeComponent implements OnInit {
  @ViewChild('bloc_anim') bloc_anim: ElementRef;
  //Desactive le btn valider avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;

  Id_User_Connected: string = '';
  //La valeur du code qui a etait saisis dans le champs il est initailiser car je desactive le
  //btn valider avec codeUserSaisi.length
  codeUserSaisi: any = '';
  //La valeur du code qui a etait recuperer dans la base de donne
  codeUserbd: any;
  constructor(
    private emitService: EmitEvent,
    private user: UserService,
    private gard: GardGuard,
    private alertError: ErrorService
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
      .catch(() => {
        this.alertError.notifyAlertErrorDefault();
      });
  }

  //Methode Pour passer a la verification du code ..
  //TODO
  valider() {
    let instance = gsap.timeline();
    //Activation de l'animation du cercle
    instance.to(this.bloc_anim.nativeElement, {
      visibility: 'visible',
    });
    instance.to('.blocks', {
      visibility: 'visible',
    });
    //Verification..
    if (this.codeUserSaisi == this.codeUserbd) {
      instance.to('.blocks', {
        visibility: 'hidden',
      });
      instance.to('.patiente', {
        text: 'VALIDE',
        duration: 1,
      });
      instance.to(this.bloc_anim.nativeElement, {
        backgroundColor: '#0f0',
        duration: 1,
      });
      setTimeout(() => {
        this.emitService.emit_Event_Update_({
          type: EventType.VERIFICATION_CODE,
          data_paylode_Number: 1,
        });
      }, 5000);
    } else {
      //Attendre 2s masquer les blocks et mettre le containerBolck a red
      setTimeout(() => {
        instance.to('.blocks', {
          visibility: 'hidden',
        });
        instance.to('.patiente', {
          text: 'INVALIDE',
          duration: 1,
        });
        instance.to(this.bloc_anim.nativeElement, {
          backgroundColor: 'red',
          duration: 1,
        });
      }, 2000);
      //Attendre 4s pour emettre le resultat
      setTimeout(() => {
        this.emitService.emit_Event_Update_({
          type: EventType.VERIFICATION_CODE,
          data_paylode_Number: 0,
        });
      }, 4000);
      //Attendre 8s pour arrete l'annimation
      setTimeout(() => {
        gsap.to(this.bloc_anim.nativeElement, {
          visibility: 'hidden',
        });

        this.restaurAnim();
      }, 6000);
      this.reset();
    }
  }
  //Methode pour restaurer animation
  //TODO
  restaurAnim() {
    let instance = gsap.timeline();
    instance.to('.patiente', {
      text: 'CIDAD',
      duration: 0.1,
    });
    instance.to(this.bloc_anim.nativeElement, {
      backgroundColor: '#333',
      duration: 0.1,
    });
  }
  //Methode pour reinitialiser les valeures..
  //TODO
  reset() {
    this.codeUserSaisi = '';
  }
}
