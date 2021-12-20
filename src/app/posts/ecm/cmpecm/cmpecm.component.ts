import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { BugModel } from 'src/app/Models/bug';
//import { ModelVueDialogComponent } from '../model-vue-dialog/model-vue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import {
  EventModel,
  EventModelObjBug,
  EventType,
} from 'src/app/Models/eventAction';

import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-cmpecm',
  templateUrl: './cmpecm.component.html',
  styleUrls: ['./cmpecm.component.css'],
})
export class CmpecmComponent implements OnInit {
  AnnimationSuccess: boolean = false;
  tbSignalUserCommentaire: boolean[] = [];
  tbViewUserCommentaire: boolean[] = [];
  tbSignalUserCharged: boolean = false;
  tbViewSignalUserCharged: boolean = false;
  tbViewUser: boolean[] = [];
  tbViewUserCharged: boolean = false;
  nomUserNotify: string = '';
  ppUserNotify: string = '';
  tbCmp: BugModel[] | any = [];

  tbCmpCh: BugModel[] | any = [];
  chargement: boolean = true;

  chargementError: boolean = false;
  user_Id_Connect: string;
  nomUser: string = '';
  prenomUser: string = '';
  nbrReponse: number;
  nbrReponseCoche: number;
  promoUser: string = '';
  fantome: string = '';
  ppUserInfo: string = '';
  securiteUser: string = '';
  subscription: Subscription = new Subscription();
  page_Event?: number = 1;
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;
  /* ATTENTION ....Cette partie des variables est complexe ECM..*/
  /*
  Ces variables sont des variables d'ecriture memoire qui me permetrons d'identifier les evenements
  et leur donnees chaque Event la fonction appelle va ecrire sur la variable aQui pour que apres le traitement
  de la verification du code on puis l'identifier et le rappeller pour passer a l'action..
   la fonction va aussi ecrire sur a variable obj_Event pour apres rappelle de cette fonction
   on puisse la passé cette variable obj_Event ...
*/
  aQui: string = '';
  obj_Event: BugModel;
  //variable pour anim cardTotal

  //variable pour me permetre de savoir dans quel parti du tab le user se trouve
  indiceTabChange: number = 0;
  constructor(
    private serviceBug: BugService,
    private authService: GardGuard,
    private dialog: MatDialog,
    private eventService: EmitEvent,
    private userService: UserService,
    private reponseBugService: ReponseBugService,
    private user: UserService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private errorAlertService: ErrorService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    //recuperation des information du User Connected pour voir si son compte est securisé ou pas
    //TODO
    this.user
      .getInfoUser(this.user_Id_Connect)
      .then((data_User) => {
        this.nomUserNotify = data_User.nom;
        this.ppUserNotify = data_User.ppUser;
        this.securiteUser = data_User.securite;
      })
      .catch(() => {
        const message =
          "Une erreur inattendu ! l'or de la recupération de vos données ! Veillez actualiser ou vérifier votre connexion ...";
        this.openSnackBar(message, 'ECM');
      });
    //...Subscription pour la recuperation du tbServiceBug
    this.subscription.add(
      this.serviceBug.tbSubjectBugService.subscribe(
        (valuetb: any[]) => {
          if (valuetb) {
            this.tbCmpCh = this.tbCmp = valuetb ? valuetb : [];
            //retraitement de tabChanger pour represent les mm post au user selon ou il etait au tab
            this.traitementTabChanged(this.indiceTabChange);

            this.chargement = false;
            this.chargementError = false;
          }

          this.verifyViewUserPaginate(this.page_Event);
          this.verifySignaleUserCommentairePaginate(this.page_Event);
          this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        },
        (error) => {
          alert(
            "erreur ! l'or de la recupération des données ! Veillez actualiser ou vérifier votre connexion ..."
          );
        }
      )
    );
    this.serviceBug.updatetbBugService();

    //temps pour le delais de recuperation de la base de donnee
    setTimeout(() => {
      if (this.chargement) {
        this.chargement = false;
        this.chargementError = true;
      }
    }, 45000);
    //Emmission event pour affiche parametre ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.AFFICHE_PARAMETRE_ECM,
    });
    //Abonnement pour EventEmit de recupere les evennements ...
    //TODO
    //event code
    this.subscription.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          this.traintementEmitEventVerifyCode(data_Event);
        }
      )
    );
    //TODO
    //event bug
    this.subscription.add(
      this.eventService.emitEventSubjectObjBug.subscribe(
        (data_Event: EventModelObjBug) => {
          this.traintementEmitEvent(data_Event);
        }
      )
    );
    //TODO
    //event annimation success
    this.subscription.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          switch (data_Event.type) {
            case EventType.ANIM_NOTIFY_SUCCESS_BUG:
              this.annimAlertSuccess();
              break;
          }
        }
      )
    );
  }
  /*.....................................................................................*/
  //Methode pour Verifier si le user a deja pas vu ce message
  //TODO
  verifySignaleUserCommentairePaginate(pageIndex: number = 1) {
    //Lire le commentaire dessus de VerifyViewUserPaginate...
    pageIndex = 12 * (pageIndex - 1);
    this.tbSignalUserCharged = false;
    this.tbSignalUserCommentaire = [];

    if (this.user_Id_Connect != '') {
      this.tbCmpCh.forEach(
        (element: { tbcommentaireUser: string | string[] }) => {
          const indexElement: number = this.tbCmpCh.indexOf(element);
          if (indexElement >= pageIndex) {
            //verifier si le user fait parti  de ce qui ont commenté...
            if (element.tbcommentaireUser.includes(this.user_Id_Connect)) {
              this.tbSignalUserCommentaire.push(true);
            } else {
              this.tbSignalUserCommentaire.push(false);
            }
          }
        }
      );
      this.tbSignalUserCharged = true;
    } else {
      //  this.alertErrorDefaultService.notifyAlertErrorDefault();
    }
  }
  //Methode pour Verifier si le user a deja pas vu ce message
  //TODO
  verifyViewSignaleUserCommentairePaginate(pageIndex: number = 1) {
    //Lire le commentaire dessus de VerifyViewUserPaginate...
    pageIndex = 12 * (pageIndex - 1);
    this.tbViewSignalUserCharged = false;
    this.tbViewUserCommentaire = [];
    if (this.user_Id_Connect != '') {
      this.tbCmpCh.forEach(
        (element: { tbViewcommentaireUser: string | string[] }) => {
          const indexElement: number = this.tbCmpCh.indexOf(element);
          if (indexElement >= pageIndex) {
            //verifier si le user fait parti  de ce qui ont commenté ...
            if (element.tbViewcommentaireUser.includes(this.user_Id_Connect)) {
              this.tbViewUserCommentaire.push(true);
            } else {
              this.tbViewUserCommentaire.push(false);
            }
          }
        }
      );
      this.tbViewSignalUserCharged = true;
    } else {
      //   this.alertErrorDefaultService.notifyAlertErrorDefault();
    }
  }
  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  traintementEmitEventVerifyCode(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VERIFICATION_CODE:
        //appelle pour la verification
        this.verifyReponseEvent(data_Event.data_paylode_Number);
        break;
    }
  }
  traintementEmitEvent(data_Event: EventModelObjBug) {
    switch (data_Event.type) {
      case EventType.CHANGE_PAGINATE:
        if (data_Event.data_paylode_String === 'ecm') {
          this.page_Event = data_Event.data_paylode_Number;
          this.verifyViewUserPaginate(data_Event.data_paylode_Number);

          this.verifySignaleUserCommentairePaginate(
            data_Event.data_paylode_Number
          );
          this.verifyViewSignaleUserCommentairePaginate(
            data_Event.data_paylode_Number
          );
          break;
        }
        break;
      case EventType.VIEW_INFO_USER:
        this.onViewInfoUser(data_Event.data_paylode_obj_Bug);
        break;
      case EventType.NAVIGATBUG:
        this.onNavigate(data_Event.data_paylode_obj_Bug);
        break;
      case EventType.CHANGEETATBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'CHANGEETATBUG';
        this.obj_Event = data_Event.data_paylode_obj_Bug;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
      case EventType.NBR_REPONSE:
        this.onViewNbrReponse(data_Event.data_paylode_obj_Bug);
        break;
      case EventType.UPDATEBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'UPDATEBUG';
        this.obj_Event = data_Event.data_paylode_obj_Bug;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
      case EventType.DELETEBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'DELETEBUG';
        this.obj_Event = data_Event.data_paylode_obj_Bug;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
    }
  }
  //Traitement de la reponse du event code de verification ...
  verifyReponseEvent(reponse: any) {
    if (reponse == 1) {
      this.dialog.closeAll();
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'CHANGEETATBUG':
          this.onChangeEtatBug(this.obj_Event);
          break;
        case 'UPDATEBUG':
          this.onUpdateBug(this.obj_Event);
          break;
        case 'DELETEBUG':
          this.onDeletBug(this.obj_Event);
          break;
      }
    } else {
      if (this.nbrTentative > 1) {
        --this.nbrTentative;
        const message = `Votre code est incorrect ! tentative (s) restante (s) ${this.nbrTentative}`;
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      } else {
        this.dialog.closeAll();
        //Redirection apres nbrtentative atteint pour reinitialiser le code
        const message =
          'Veillez entrer votre email afin de reinitialiser votre code a 1234';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        this.route.navigate(['/parametre']);
      }
    }
  }
  //Methode pour Verifier si le user a deja pas vu ce post
  //TODO
  verifyViewUserPaginate(pageIndex: number = 1) {
    /*Bien ! avec la pagination les index vont changer exp si a la page 2..et autre
     *les bug vont changer d'index pour resoudre ce probleme on redefini le tbView a
     *l'aide de l'index
     */
    pageIndex = 12 * (pageIndex - 1);
    this.tbViewUserCharged = false;
    this.tbViewUser = [];
    if (this.user_Id_Connect != '') {
      this.tbCmpCh.forEach((element: { tbViewUser: string | string[] }) => {
        const indexElement: number = this.tbCmpCh.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.tbViewUser.includes(this.user_Id_Connect)) {
            this.tbViewUser.push(false);
          } else {
            this.tbViewUser.push(true);
          }
        }
      });
      this.tbViewUserCharged = true;
    } else {
      // const message = 'Veillez verifier votre connexion ou actualisé !';
      //Affichage de l'alerte
      //   this.openSnackBar(message, 'ECM');
    }
  }
  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.traitementTabChanged(tabChangeEvent.index);
  }
  //TODO
  traitementTabChanged(indiceTabChange: number) {
    switch (indiceTabChange) {
      case 0:
        this.indiceTabChange = 0;
        this.getAll();
        //Redefini les val du tb car les index vont changer
        this.verifyViewUserPaginate(this.page_Event);
        this.verifySignaleUserCommentairePaginate(this.page_Event);
        this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        break;
      case 1:
        this.indiceTabChange = 1;
        this.getMesPost();
        this.verifyViewUserPaginate(this.page_Event);
        this.verifySignaleUserCommentairePaginate(this.page_Event);
        this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        break;
      case 2:
        this.indiceTabChange = 2;
        this.getResolu();
        this.verifyViewUserPaginate(this.page_Event);
        this.verifySignaleUserCommentairePaginate(this.page_Event);
        this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        break;
      case 3:
        this.indiceTabChange = 3;
        this.getNonResolu();
        this.verifyViewUserPaginate(this.page_Event);
        this.verifySignaleUserCommentairePaginate(this.page_Event);
        this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        break;
      case 4:
        this.indiceTabChange = 4;
        this.getModify();
        this.verifyViewUserPaginate(this.page_Event);
        this.verifySignaleUserCommentairePaginate(this.page_Event);
        this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
        break;
    }
  }

  //Methode de getAll()
  //TODO
  getAll(): void {
    this.tbCmpCh = this.tbCmp;
  }
  //Methode de getMesPost()
  //TODO
  getMesPost(): void {
    this.tbCmpCh =
      this.tbCmp.filter(
        (bug: { user_Id: string }) => bug.user_Id == this.user_Id_Connect
      ).length !== 0
        ? this.tbCmp.filter(
            (bug: { user_Id: string }) => bug.user_Id == this.user_Id_Connect
          )
        : [];
  }
  //Methode de getResolu()
  //TODO
  getResolu(): void {
    this.tbCmpCh =
      this.tbCmp.filter((bug: { etat: string }) => bug.etat == 'Résolu')
        .length !== 0
        ? this.tbCmp.filter((bug: { etat: string }) => bug.etat == 'Résolu')
        : [];
  }

  //Methode de getResolu()
  //TODO
  getNonResolu(): void {
    this.tbCmpCh =
      this.tbCmp.filter((bug: { etat: string }) => bug.etat == 'Non Résolu')
        .length !== 0
        ? this.tbCmp.filter((bug: { etat: string }) => bug.etat == 'Non Résolu')
        : [];
  }

  //Methode de getModify()
  //TODO
  getModify(): void {
    this.tbCmpCh =
      this.tbCmp.filter((bug: { bugUpdate: number }) => bug.bugUpdate == 1)
        .length !== 0
        ? this.tbCmp.filter((bug: { bugUpdate: number }) => bug.bugUpdate == 1)
        : [];
  }
  //Methode Search
  //TODO
  search(query: string): void {
    this.tbCmpCh = query
      ? this.tbCmp.filter((bug: { language: string }) =>
          bug.language.toLocaleString().includes(query.toLowerCase())
        )
      : this.tbCmp;
    /*
    this.eventService.emit_Event_Update_({
      type: EventType.NO_ANIM_TOTAL_CARD,
    });
    */
    this.verifyViewUserPaginate(this.page_Event);
    this.verifySignaleUserCommentairePaginate(this.page_Event);
    this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
  }

  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser() {
    if (this.securiteUser == 'true') {
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUser == 'false') {
      //Passe directement a la suppression si le user n'a pas securiser son compte
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'CHANGEETATBUG':
          this.onChangeEtatBug(this.obj_Event);
          break;
        case 'UPDATEBUG':
          this.onUpdateBug(this.obj_Event);
          break;
        case 'DELETEBUG':
          let confirmationDelete: boolean = confirm(
            'Confirmez-vous la suppression'
          );
          if (confirmationDelete) {
            this.onDeletBug(this.obj_Event);
            break;
          }
      }
    }
  }
  //
  //......Voir les information du User
  //TODO
  onViewInfoUser(objBug: BugModel) {
    this.userService
      .getInfoUser(objBug.user_Id)
      .then((data_User) => {
        this.nomUser = data_User.nom;
        this.prenomUser = data_User.prenom;
        this.promoUser = data_User.promotion;
        this.fantome = data_User.fantome;
        this.ppUserInfo = data_User.ppUser;
      })
      .catch((error) => {
        this.errorAlertService.notifyAlertErrorDefault();
      });
    //Netoyage des donnes avant d'afficher un autre appelle de viewInfoUser
    this.nomUser = '';
    this.prenomUser = '';
    this.promoUser = '';
    this.fantome = '';
  }
  //.....voir les details
  //TODO
  onNavigate(objBug: BugModel) {
    this.serviceBug.onNavigate(objBug);
  }

  //Methode pour voir le nombre de reponses
  //TODO
  onViewNbrReponse(objBug: BugModel) {
    this.nbrReponse = this.reponseBugService.verifyNbrReponse(objBug.bug_Id);
    this.nbrReponseCoche = this.reponseBugService.verifyCheckedReponse(
      objBug.bug_Id
    );
  }
  //Changer Etat
  //TODO
  onChangeEtatBug(objBug: BugModel) {
    this.serviceBug.onChangeEtatBug(objBug);
  }

  //Methode Pour la modification du bug
  //TODO
  onUpdateBug(objBug: BugModel) {
    this.serviceBug.navUpdateBug(objBug);
  }

  //Methode Pour la suppression du bug
  //TODO
  onDeletBug(objBug: BugModel) {
    this.serviceBug.deleteBug(objBug);
  }
  //Methode pour annimation success
  //TODO
  annimAlertSuccess(): number {
    if (this.AnnimationSuccess) {
      return 0;
    }
    this.AnnimationSuccess = true;
    let instance = gsap.timeline();
    instance.to('.alert-notify', {
      ease: 'back',
      right: 10,
      duration: 1,
    });
    instance.to('.alert-notify p', {
      delay: 1,
      text: 'Chargement terminer ... Tout les posts ont étaient bien rechargés ',
      duration: 2,
    });
    instance.to('.progress-bar', {
      width: 210,
      duration: 2.5,
    });
    setTimeout(() => {
      instance.reversed(true);
      // le reversed prendra aussi une seconde
      setTimeout(() => {
        this.AnnimationSuccess = false;
      }, 6500);
    }, 7000);
    return 1;
  }
  //Methode pour la demande de code
  //TODO
  openDialog() {
    this.dialog.open(AlertDialogueCodeComponent);
  }
  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //......
  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    //Emmission event pour fermer les parametres ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.FERMER_PARAMETRE_ECM,
    });
  }
}
