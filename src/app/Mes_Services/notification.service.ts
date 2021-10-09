import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';
import 'firebase/database';
import { Subject } from 'rxjs';
import { EventType } from '../Models/eventAction';
import { NotificationModel } from '../Models/notification';
import { EmitEvent } from './emitEvent.service';
import { GardGuard } from './gard.guard';
@Injectable()
export class Notification {
  constructor(
    private gardService: GardGuard,
    private _snackBar: MatSnackBar,
    private evenService: EmitEvent
  ) {}
  private tbNotify: NotificationModel[] = [];

  //Mise place des Subjects
  //TODO
  public tbNotifySubject: Subject<NotificationModel[]> = new Subject<
    NotificationModel[]
  >();

  //Mise en place des emits
  //TODO
  emitUpdateTbNotify() {
    // this.onFilterDoublonAndCompteNbrReponsePoste();
    this.tbNotifySubject.next(this.tbNotify);
    //Emission des deux tb
    // this.emitUpdatetbFilterDoublonSubject();
    //this.emitUpdatetbNbrReponseSubject();
  }

  //...Sauvegarde de la base de donnee
  //TODO
  sauvegardeBase() {
    firebase.database().ref('/bdNotify').set(this.tbNotify);
    console.log('sauvegardeBase success Notify...');
  }
  //.....Recuperation de la base de donnee..
  //TODO
  recupbaseNotify() {
    firebase
      .database()
      .ref('/bdNotify')
      .on('value', (valueBd) => {
        this.tbNotify = valueBd.val() ? valueBd.val() : [];
        this.emitUpdateTbNotify();
        //Emmission pour alerte le rechargement de la base de donnee
        this.evenService.emit_Event_Update_({
          type: EventType.BD_NOTIFY_LOADED,
        });
      });
    console.log('recupbase success Notify...');
  }
  /*...............................PARTIE DES FONCTIONS..................................*/
  //Methode pour la creation d'une collection notify l'or de l'inscription
  //TODO
  initNotify(newModelNotify: NotificationModel) {
    this.tbNotify.unshift(newModelNotify);
    this.sauvegardeBase();
    this.emitUpdateTbNotify();
  }
  //Methode pour Notifier un nouveau cette methode est un broadcast tt le monde sera notifier
  //TODO
  notifyNewBug() {
    //Boucle sur tbNotify pour que tout le monde soit notifier
    this.tbNotify.forEach((noti) => {
      noti.length_Tb_Bug += 1;
      noti.nbrTotalNotify += 1;
    });
    this.sauvegardeBase();
    this.emitUpdateTbNotify();
  }
  //Methode pour Notifier une Reponse la collection du user...........
  //TODO
  notifyReponseBug(user_Id_Bug: string, titre_Bug: string) {
    let trouver: boolean = false;
    //Recuperation de l'id du User qui repond car si c'est le user qui reponse a son propre
    //post il ne sera pas notifier
    let userIdRepondant = this.gardService.user_Id_Connect;
    if (userIdRepondant != user_Id_Bug) {
      //Filtrage du tbNotify pour acceder a la collection du user..
      let tbFilterByIdBug: NotificationModel[];
      tbFilterByIdBug = this.tbNotify.filter(
        (reponse) => reponse.id_User == user_Id_Bug
      );
      tbFilterByIdBug[0].tbIdReponseBug.forEach((item) => {
        if (item.titre == titre_Bug) {
          item.nbr += 1;
          trouver = true;
        }
      });
      if (!trouver) {
        tbFilterByIdBug[0].tbIdReponseBug.unshift({ titre: titre_Bug, nbr: 1 });
        //Suppression de la valeur initialiser par defaut...
        if (tbFilterByIdBug[0].tbIdReponseBug[1].nbr == 0) {
          tbFilterByIdBug[0].tbIdReponseBug.splice(1, 1);
        }
      }

      tbFilterByIdBug[0].nbrTotalNotify += 1;
      this.sauvegardeBase();
      this.emitUpdateTbNotify();
    } else {
      setTimeout(() => {
        const message =
          'Nous constatons que vous venez de répondre a votre propre Post ,donc vous ne serez pas notifié de cette réponse ...';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      }, 2000);
    }
  }
  //Methode pour Notifier un commentaire la collection du user...........
  //TODO
  notifyCommentaireReponseBug(debut_Reponse: string, user_Id_Reponse?: string) {
    let trouver: boolean = false;
    //Recuperation de l'id du User qui repond car si c'est le user qui reponse a son propre
    //post il ne sera pas notifier
    let userIdRepondant = this.gardService.user_Id_Connect;
    if (userIdRepondant != user_Id_Reponse) {
      //Filtrage du tbNotify pour acceder a la collection du user..
      let tbFilterByIdReponse: NotificationModel[];
      tbFilterByIdReponse = this.tbNotify.filter(
        (reponse) => reponse.id_User == user_Id_Reponse
      );
      //On cherche d'abord si ce id n'existe pas
      tbFilterByIdReponse[0].tbIdCommentaireReponse.forEach((item) => {
        if (item.titre == debut_Reponse) {
          item.nbr += 1;
          trouver = true;
        }
      });
      //Cas ou l'id n'est pas le tb apres la boucle
      if (!trouver) {
        tbFilterByIdReponse[0].tbIdCommentaireReponse.unshift({
          titre: debut_Reponse,
          nbr: 1,
        });
        //Suppression de la valeur initialiser par defaut...
        if (tbFilterByIdReponse[0].tbIdCommentaireReponse[1].nbr == 0) {
          tbFilterByIdReponse[0].tbIdCommentaireReponse.splice(1, 1);
        }
      }
      tbFilterByIdReponse[0].nbrTotalNotify += 1;
      this.sauvegardeBase();
      this.emitUpdateTbNotify();
    } else {
      setTimeout(() => {
        const message =
          'Nous constatons que vous venez de commenté a votre propre réponse ,donc vous ne serez pas notifié de cet commantaire ...';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      }, 2000);
    }
  }

  //TODO
  onResetCollectionNotifyUser() {
    //Filtrage du tbNotify pour acceder a la collection du user..
    //Premierement on recupere la collection du user dans la tbNotify aveson ID
    //TODO
    let tbFilterByIdNotify: NotificationModel[];
    tbFilterByIdNotify = this.tbNotify.filter(
      (reponse) => reponse.id_User == this.gardService.user_Id_Connect
    );
    //Deuxiement on recupere son tbIdBug ce tb contient les Id des posts qui on etaient repondu
    //TODO
    tbFilterByIdNotify[0].length_Tb_Bug = 0;
    tbFilterByIdNotify[0].nbrTotalNotify = 0;
    tbFilterByIdNotify[0].tbIdReponseBug = [{ titre: '', nbr: 0 }];
    tbFilterByIdNotify[0].tbIdCommentaireReponse = [{ titre: '', nbr: 0 }];
    this.sauvegardeBase();
    this.emitUpdateTbNotify();
  }
  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
