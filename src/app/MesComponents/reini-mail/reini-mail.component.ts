import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';

import { ErrorService } from 'src/app/Mes_Services/error.Service';

import { TextPlugin } from 'gsap/TextPlugin';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { AuthService } from 'src/app/Mes_Services/auth.Service';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-reini-mail',
  templateUrl: './reini-mail.component.html',
  styleUrls: ['./reini-mail.component.css'],
})
export class ReiniMailComponent implements OnInit {
  @ViewChild('bloc_anim') bloc_anim: ElementRef;
  //Desactive le btn valider avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;

  Id_User_Connected: string = '';
  //La valeur du code qui a etait saisis dans le champs il est initailiser car je desactive le
  //btn valider avec codeUserSaisi.length
  mailUserSaisi: any = '';
  //La valeur du code qui a etait recuperer dans la base de donne
  codeUserbd: any;
  constructor(
    private emitService: EmitEvent,
    private user: UserService,
    private gard: GardGuard,
    private alertError: ErrorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter ...
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
  }
  test() {
    this.authService
      .reInitialisation(this.mailUserSaisi)
      .then(() => {
        this.alertError.notifyAlertErrorDefault('mail bien envoyer');
      })
      .catch(() => {
        this.alertError.notifyAlertErrorDefault('mail non envoyer');
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
    if (this.mailUserSaisi == this.codeUserbd) {
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
    this.mailUserSaisi = '';
  }
}
