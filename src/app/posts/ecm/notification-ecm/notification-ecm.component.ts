import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { BugModel } from 'src/app/Models/bug';
import { NotifyModel } from 'src/app/Models/eventAction';
import { NotificationModel } from 'src/app/Models/notification';

@Component({
  selector: 'app-notification-ecm',
  templateUrl: './notification-ecm.component.html',
  styleUrls: ['./notification-ecm.component.css'],
})
export class NotificationEcmComponent implements OnInit, OnDestroy {
  //Variable pour les notifications...
  tbNotify: NotificationModel[] = [];
  tbFilterDoublonSubjectCmp: string[] = [];
  tbNbrReponseSubjectCmp: number[] = [];

  tbNbrReponse: number[] = [];
  tbFilterDoublon: string[] = [];
  user_Id_Connect: string;
  //Variable de subcription
  subscriptionDbNotify: Subscription = new Subscription();
  subscriptiontbFilterDoublonSubject: Subscription = new Subscription();
  subscriptiontbNbrReponseSubject: Subscription = new Subscription();
  subscriptionTbCmp: Subscription = new Subscription();

  nbrNewBug: number = 0;
  tbIdBug: NotifyModel[] = [];
  tbObjectBug: string[] = [];
  nbrtbIdBug: number = 0;
  tbIdCommentaireReponse: NotifyModel[] = [];
  nbrtbIdCommentaireReponse: number = 0;
  nbrTotalNotify: number = 0;
  tbCmp: BugModel[] = [];
  @Input() nomUserNotify: string;

  ///Ces variables sont des variable de communication qui permet l'appelle des methodes avec les fonctions async
  appellerecupObjById: boolean = false;

  constructor(
    private notifyService: Notification,
    private serviceBug: BugService,

    private authService: GardGuard
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    //Mise en place de la subscription pour le tbNotify...
    //TODO
    this.subscriptionDbNotify = this.notifyService.tbNotifySubject.subscribe(
      (data_db_Notify: NotificationModel[]) => {
        //Des que les tbDbNotify arriver je lance la methode de filtre
        if (data_db_Notify.length > 0) {
          this.tbNotify = data_db_Notify;

          //Filtrage du tbNotify pour acceder a la collection du user..
          //Premierement on recupere la collection du user dans la tbNotify aveson ID
          //TODO
          let tbFilterByIdNotify: NotificationModel[];
          tbFilterByIdNotify = this.tbNotify.filter(
            (reponse) => reponse.id_User == this.user_Id_Connect
          );

          //Recuperation des new Bug
          //todo
          this.nbrNewBug = tbFilterByIdNotify[0].length_Tb_Bug;

          //Recuperation du tbBud
          //todo
          if (tbFilterByIdNotify[0].tbIdReponseBug[0].nbr != 0) {
            this.tbIdBug = tbFilterByIdNotify[0].tbIdReponseBug;
            //Comptage de nbr reponse total
            this.nbrtbIdBug = 0;
            this.tbIdBug.forEach((item) => {
              this.nbrtbIdBug += item.nbr;
            });
            //Appelle de la methode recupObjById
            //todo
            alert('appelle recup byIdBug');
            this.recupObjById();
            //Cette tactique permet a la subsTbCmp d'appeller la methode recupObjById quand les donnees sont completes
            this.appellerecupObjById = true;
          }
          //Recuperation du tbIdCommentaireReponse
          //todo
          if (tbFilterByIdNotify[0].tbIdCommentaireReponse[0].nbr != 0) {
            this.tbIdCommentaireReponse =
              tbFilterByIdNotify[0].tbIdCommentaireReponse;
            //Comptage nbr commentaire total
            this.nbrtbIdCommentaireReponse = 0;
            this.tbIdCommentaireReponse.forEach((item) => {
              this.nbrtbIdCommentaireReponse += item.nbr;
            });
          }

          //Recuperation des notifications total
          //todo
          this.nbrTotalNotify = tbFilterByIdNotify[0].nbrTotalNotify;
        }
      },
      (error) => {
        alert('Erreur recup Notify Veiller actualisée');
      }
    );
    this.notifyService.emitUpdateTbNotify();
    //...Subscription pour la recuperation du tbServiceBug
    this.subscriptionTbCmp = this.serviceBug.tbSubjectBugService.subscribe(
      (valuetb) => {
        if (valuetb) {
          this.tbCmp = valuetb ? valuetb : [];
          if (this.appellerecupObjById) {
            //Appelle de la methode recupObjById
            //todo
            alert('appelle recup byTbCmp');
            this.recupObjById();
          }
        }
      },
      (error) => {
        alert('erreur recup database !');
      }
    );
    this.serviceBug.updatetbBugService();
  }
  /**.................................................................................. */
  //Cette methode permet de recupere le titre du post concerne pour la notifaction recuperation fait
  //a partir de son Id dans le tbCmp
  //TODO
  recupObjById() {
    alert('recupObCaaled');
    let trouver: Boolean = false;
    this.tbIdBug.forEach((itemtbIdBug) => {
      this.tbCmp.forEach((itemtbCmp) => {
        if (itemtbIdBug.id == itemtbCmp.bug_Id) {
          //recuperation du titre qui sera stocke dans tbObjectBug
          //on verifi d'abord si ce obj n'est deja pas pushe dans le tb avant qu'on push le mm element plusieurs fois
          this.tbObjectBug.forEach((item) => {
            if (item == itemtbCmp.titre) {
              trouver = true;
            }
          });
          if (!trouver) {
            this.tbObjectBug.unshift(itemtbCmp.titre);
          }
        }
      });
    });
    alert(this.tbObjectBug.length);
  }

  ngOnDestroy(): void {
    this.subscriptionDbNotify.unsubscribe();
    this.subscriptiontbFilterDoublonSubject.unsubscribe();
    this.subscriptiontbNbrReponseSubject.unsubscribe();
    this.subscriptionTbCmp.unsubscribe();
    this.notifyService.onResetCollectionNotifyUser();
  }
}
