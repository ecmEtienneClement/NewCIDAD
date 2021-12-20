import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { ReponseBugModel } from 'src/app/Models/reponseBug';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.component.html',
  styleUrls: ['./viewdetails.component.css'],
})
export class ViewdetailsComponent implements OnInit, OnDestroy {
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnCommentaire: boolean = false;
  @Input() tbSignalUserCommentaire: boolean[];
  @Input() tbViewUserCommentaire: boolean[];
  @Input() tbViewUser: boolean[];
  @Input() tbViewUserCharged: boolean;
  @Input() tbSignalUserCharged: boolean;
  @Input() tbViewSignalUserCharged: boolean;
  @Input() prenom: string;
  @Input() nom: string;
  @Input() promo: string;
  @Input() fantome: string;
  @Input() tbReponseBug: ReponseBugModel[];
  @Input() totalPage: number;
  @Input() user_Id_Connect: string;
  @Input() user_Id_Bug: string;
  subscription: Subscription = new Subscription();
  page: number = 1;
  commentaire: string = '';
  etatDeployerBtnGeneral: boolean = false;
  annicliquer: boolean = false;
  tbInstanceGsap: any[] = [];
  tbInstanceGsapGeneral: any[] = [];
  constructor(private eventService: EmitEvent) {}

  ngOnInit(): void {
    //Emmission event pour affiche parametre ecm detail
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.AFFICHE_PARAMETRE_DT_ECM,
    });
    //Abonnement pour EventEmit de recupere les evennements parametre affichage  ...
    //TODO
    this.subscription.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          this.traintementEmitEventParametreAffichage(data_Event);
        }
      )
    );
  }

  /**......................................................................... */
  //Traitement des event parametre affichage
  //TODO
  traintementEmitEventParametreAffichage(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.OPEN_BTN:
        //on verifie si c'est ce component qui a demander l'affichage du parametre
        if (data_Event.data_paylode_String === 'detail ecm') {
          this.etatDeployerBtnGeneral = !this.etatDeployerBtnGeneral;
          this.deployerBtnGeneral();
          break;
        } else {
          break;
        }
    }
  }
  //Suppression des donnees a envoye..
  //TODO
  onResetForm() {
    this.commentaire = '';
  }
  //Methode pour animer le txt cliqueer pour voir la reponse
  //TODO
  animeTxtCliquer() {
    this.annicliquer = true;
    let instance = gsap.timeline();
    instance.to(`.cliquerPourDeplier`, {
      text: 'CLIQUER POUR DEPLIER ...',
      duration: 2.5,
      repeat: -1,
    });
  }

  //Methode pour animer le txt cliqueer pour voir la reponse
  //TODO
  animeTxtCopy(indice: number) {
    let instance = gsap.timeline();

    instance.to(
      `.card-cible:nth-child(${indice + 1}) .parentTxtCliqer .blocTxtCopi`,
      {
        ease: 'expo',
        top: 0,
        visibility: 'visible',
        duration: 1,
      }
    );

    setTimeout(() => {
      instance.reversed(true);
    }, 2000);
  }
  //Methode pour deployer les btn
  //TODO
  deployerBtnGeneral() {
    let instance = gsap.timeline();
    if (this.etatDeployerBtnGeneral) {
      this.tbInstanceGsapGeneral.push(instance);
      instance.to(`.card-cible .blcBtn .btn-nav`, {
        opacity: 0,
        duration: 0.5,
        visibility: 'hidden',
      });

      instance.to(`.card-cible .blcBtn .btn-delete`, {
        ease: 'back',
        visibility: 'visible',
        right: 0,
        duration: 1,
      });
      instance.to(`.card-cible .blcBtn .btn-copy`, {
        ease: 'back',
        visibility: 'visible',
        right: 40,
        duration: 1,
      });
      instance.to(`.card-cible .blcBtn .btn-merci`, {
        ease: 'back',
        visibility: 'visible',
        right: 80,
        duration: 1,
      });
      instance.to(`.card-cible .blcBtn .btn-user`, {
        ease: 'back',
        visibility: 'visible',
        right: 155,
        duration: 1,
      });
    } else {
      this.tbInstanceGsapGeneral[0].reversed(true);
      this.tbInstanceGsapGeneral.splice(0, 1);
    }
  }
  deployerBtn(indice: number) {
    if (this.tbInstanceGsap.length > 0) {
      this.tbInstanceGsap[0].reversed(true);
      this.tbInstanceGsap.splice(0, 1);
    }
    let instance = gsap.timeline();
    this.tbInstanceGsap.unshift(instance);
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-nav`, {
      opacity: 0,
      duration: 0.5,
      visibility: 'hidden',
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-closed`, {
      ease: 'bounce',
      visibility: 'visible',
      left: 0,
      duration: 2,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-delete`, {
      ease: 'back',
      visibility: 'visible',
      right: 0,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-copy`, {
      ease: 'back',
      visibility: 'visible',
      right: 40,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-merci`, {
      ease: 'back',
      visibility: 'visible',
      right: 80,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-user`, {
      ease: 'back',
      visibility: 'visible',
      right: 155,
      duration: 1,
    });
  }
  //Methode pour fermer le blc les btn
  //TODO
  closeBlcBtn() {
    this.tbInstanceGsap[0].reversed(true);
    this.tbInstanceGsap.splice(0, 1);
  }

  /*
   *MISE EN PLACE DES METHODES POUR L'EMMISSION DES DIFFERRENTS EVENEMENTS ...
   */
  // ..................................ALERT.............................................
  //Pour PageNavigation Voir commentaire ECM pour comprendre sont ajout au Event Emit
  //Methode pour modifer le isGood du commentaire ..

  //Methode pour marquer la reponse vu
  //TODO
  viewUserReponse(obj_Reponse: ReponseBugModel) {
    if (!this.annicliquer) {
      this.animeTxtCliquer();
    }
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.VIEW_REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
    });
  }
  //Methode pour marquer le commentaire vu
  //TODO
  viewUserCommentaire(obj_Reponse: ReponseBugModel) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.VIEW_COMMENTAIRE_REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
    });
  }
  //Methode Pour Voir Les Informations du User
  //TODO
  onViewUser(obj_Reponse: ReponseBugModel) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.VIEW_INFO_USER,
      data_paylode_obj_Reponse: obj_Reponse,
    });
  }
  //Methode pour cocher la bonne reponse
  //TODO
  onCheck(obj_Reponse: ReponseBugModel) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.CHEKED_REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
    });
  }
  //Methode pour copier la reponse
  //TODO
  copyUrlAppVideo(copiReponse: string, indice: number) {
    navigator.clipboard.writeText(copiReponse);
    this.animeTxtCopy(indice);
  }
  //Recupration des donnees a envoye..
  //TODO
  onSubmitForm(obj_Reponse: ReponseBugModel) {
    this.diseableBtnCommentaire = true;
    //Event de l'Event avec string et indice
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.COMMENTER__REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
      data_paylode_String: this.commentaire,
    });
    this.commentaire = '';
    this.diseableBtnCommentaire = false;
  }
  //Methode pour supprimer la reponse ..
  //TODO
  onDelete(obj_Reponse: ReponseBugModel) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.DELETE_REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
    });
  }
  deleteCommentaire(
    obj_Reponse: ReponseBugModel,
    dateCommentaireDelete: string
  ) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.DELETE_COMMENTAIRE_REPONSE_BUG,
      data_paylode_obj_Reponse: obj_Reponse,
      data_paylode_String: dateCommentaireDelete,
    });
  }
  //Methode pour emmettre le changemant de la page afin de recalculer les valeurs du tbViewUser
  //TODO
  pageChanged(event: any) {
    this.eventService.emit_Event_Obj_Reponse_({
      type: EventType.CHANGE_PAGINATE,
      data_paylode_obj_Reponse: new ReponseBugModel(
        '',
        '',
        '',
        '',
        false,
        [],
        ''
      ),
      data_paylode_String: 'detail ecm',
      data_paylode_Number: event,
    });
    this.page = event;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    //Emmission event pour fermer les parametres ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.CLOSE_BTN,
    });
  }
}
