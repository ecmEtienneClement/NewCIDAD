import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { BugModel } from 'src/app/Models/bug';
import { EventModel, EventType } from 'src/app/Models/eventAction';
// typical import
import gsap from 'gsap';
// or get other plugins:
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import { Subscription } from 'rxjs';
export interface instanceGsap {
  indice: number;
  t: any;
}
@Component({
  selector: 'app-viewecm',
  templateUrl: './viewecm.component.html',
  styleUrls: ['./viewecm.component.css'],
})
export class ViewecmComponent implements OnInit, OnDestroy {
  @Input() prenom: string;
  @Input() nom: string;
  @Input() promo: string;
  @Input() fantome: string;
  @Input() nbrReponse: number;
  @Input() nbrReponseCoche: number;
  @Input() tbCmpCh: BugModel[];
  @Input() user_Id_Connect?: string;
  @Input() totalPage: number;
  /*Cet tb nous permet de gerer les intances de gsap*/
  tbInstanceGsap: instanceGsap[] = [];
  tbInstanceGsapNbrReponse: instanceGsap[] = [];

  page: number = 1;
  image: number = 1;
  subscriptionEvent: Subscription = new Subscription();
  //Variable pour les reglage d'annimation
  open_btn_details: boolean = false;
  open_btn: boolean = false;
  ligne_animation: boolean = true;
  constructor(private eventService: EmitEvent) {}

  ngOnInit(): void {
    //Abonnement pour EventEmit de recupere les evennements parametre affichage  ...
    //TODO
    this.subscriptionEvent = this.eventService.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        this.traintementEmitEventParametreAffichage(data_Event);
      }
    );
  }

  /*   
 ...............................PARTIE POUR REGLAGE D'AFFICHAGE ................ .........
 
*/
  traintementEmitEventParametreAffichage(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.OPEN_BTN_DETAILS:
        this.open_btn_details = !this.open_btn_details;
        break;
      case EventType.OPEN_BLOC_BTN:
        this.open_btn = !this.open_btn;
        break;
      case EventType.ANIMATION_LIGNES:
        this.ligne_animation = !this.ligne_animation;
        break;
    }
  }

  /*   
 ...............................PARTIE POUR ANIMATION CARD ................ .........
 */
  //AFFICHAGE DE LA CARD INFO USER
  //TODO
  animCardUser(indice: number) {
    if (this.tbInstanceGsap.length != 0) {
      this.tbInstanceGsap[0].t.reversed(true);
      this.tbInstanceGsap.splice(0, 1);
    }
    let instanceT: instanceGsap = { indice: indice, t: gsap.timeline() };
    this.tbInstanceGsap.push(instanceT);

    //Desactivation du btn pour eviter que le user le click une deuxiem fois sinon le card
    //va perdre des elements de son affichages
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-subtitle .user button`,
      {
        disabled: true,
      }
    );

    /**Netoyage de la card */
    //txt de la date
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-subtitle .date`,
      {
        ease: 'Power1.easeOut',
        bottom: 500,
        duration: 0.5,
      }
    );

    // txt titre
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-title .titre`,
      {
        ease: 'Power1.easeOut',
        left: -500,
        duration: 0.5,
      }
    );
    // txt details
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-content .detail`,
      {
        ease: 'Power1.easeOut',
        left: -1000,
        duration: 0.5,
      }
    );
    // txt language
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-content .language`,
      {
        ease: 'Power1.easeOut',
        left: -500,
        duration: 0.5,
      }
    );
    // btn details
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-content .btn-details`,
      {
        visibility: 'hidden',
        duration: 0.5,
      }
    );
    // txt blc btn
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-actions .bloc-btn`,
      {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.5,
      }
    );
    //Animation btn user
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-subtitle .user`,
      {
        ease: 'bounce',
        bottom: 20,
        duration: 1,
      }
    );

    instanceT.t.to(
      `.card-cible:nth-child(${
        indice + 1
      }) mat-card-subtitle .user button .fa-user-edit`,
      {
        visibility: 'hidden',
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-subtitle .user button`,
      {
        scaleX: 20,
        duration: 1,
        border: 0,
        background: '#0e1538',
      }
    );
    // Parti card User
    instanceT.t.to(`.card-cible:nth-child(${indice + 1}) .user_profil`, {
      ease: 'bounce',
      top: 0,
      duration: 1.5,
      visibility: 'visible',
    });
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) .user_profil .imgUser`,
      {
        opacity: 1,
        duration: 1,
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) .user_profil .user_info`,
      {
        ease: 'back',
        opacity: 1,
        duration: 1,
        bottom: 0,
      }
    );
  }
  //RETOUR ET NETOYAGE DU CARD USER
  //TODO
  resetCarUser() {
    this.tbInstanceGsap[0].t.reversed(true);
    this.tbInstanceGsap.splice(0, 1);
  }
  //AFFICHAGE DE LA CARD DU NBRREPONSE
  //TODO
  animCardNbrReponse(indice: number) {
    if (this.tbInstanceGsapNbrReponse.length != 0) {
      this.tbInstanceGsapNbrReponse[0].t.reversed(true);
      this.tbInstanceGsapNbrReponse.splice(0, 1);
    }
    let instanceT: instanceGsap = { indice: indice, t: gsap.timeline() };
    this.tbInstanceGsapNbrReponse.push(instanceT);
    // txt blc btn
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card-actions .bloc-btn`,
      {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.5,
      }
    );
    //AFFICHAGE CARD NBR REPONSE
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card .nbrReponse`,
      {
        ease: 'bounce',
        visibility: 'visible',
        bottom: 0,
        duration: 1.5,
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card .nbrReponse .parentNbr`,
      {
        opacity: 1,
        duration: 0.3,
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card .nbrReponse .Reponse`,
      {
        opacity: 1,
        duration: 1,
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${indice + 1}) mat-card .nbrReponse .cochee`,
      {
        opacity: 1,
        duration: 1,
      }
    );
    instanceT.t.to(
      `.card-cible:nth-child(${
        indice + 1
      }) mat-card .nbrReponse .retourUserNbr`,
      {
        opacity: 1,
        duration: 0.5,
      }
    );
  }
  //RETOUR ET NETOYAGE DU CARD NBR REPONSES
  //TODO
  resetCardNbr() {
    this.tbInstanceGsapNbrReponse[0].t.reversed(true);
    this.tbInstanceGsapNbrReponse.splice(0, 1);
  }

  /*   
 ...............................PARTIE POUR LES EMISSION D'EVENEMENTS ................ .........
 
*/
  //Methode Pour Voir Les Informations du User
  //TODO
  onViewUser(user_Id: any, indice: number) {
    this.animCardUser(indice);
    //Je patient 1s pour eviter d'afficher l'autre info du user dans le card qui entraint
    //d'etre ferme raison pour la qu'elle on patient 1s
    setTimeout(() => {
      this.eventService.emit_Event_Update_({
        type: EventType.VIEW_INFO_USER,
        data_paylode_String: user_Id,
      });
    }, 1000);
  }
  //Methode Pour la Navigation vers la page details avec event indice et la page
  //TODO
  onNavigate(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.NAVIGATBUG,
      data_paylode_String: idBug,
    });
  }
  //Methode pour voir le nombre de reponses
  //TODO
  onViewNbrReponse(idBug: string, indice: number) {
    this.image = Math.floor(Math.random() * 10);
    this.animCardNbrReponse(indice);
    setTimeout(() => {
      this.eventService.emit_Event_Update_({
        type: EventType.NBR_REPONSE,
        data_paylode_String: idBug,
      });
    }, 2000);
  }

  //Methode Pour la Modifirer le Bug avec eventBug
  //TODO
  onUpdateBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.UPDATEBUG,
      data_paylode_String: idBug,
    });
  }

  //Methode Pour la Modifirer l'etat du Bug eventBug
  //TODO
  onChangeEtatBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.CHANGEETATBUG,
      data_paylode_String: idBug,
    });
  }
  //Methode Pour la sauppression du Bug eventBug
  //TODO
  onDeletBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.DELETEBUG,
      data_paylode_String: idBug,
    });
  }
  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
  }
}
