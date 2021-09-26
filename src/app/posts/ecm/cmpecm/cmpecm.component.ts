import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { BugModel } from 'src/app/Models/bug';
//import { ModelVueDialogComponent } from '../model-vue-dialog/model-vue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';

import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cmpecm',
  templateUrl: './cmpecm.component.html',
  styleUrls: ['./cmpecm.component.css'],
})
export class CmpecmComponent implements OnInit {
  nomUserNotify: string = '';
  tbCmp: BugModel[] | any;
  tbCmpMesPostes: BugModel[] | any;
  tbCmpResolu: BugModel[] | any;
  tbCmpNonResolu: BugModel[] | any;
  tbCmpCh: BugModel[] | any;
  chargement: boolean = true;
  user_Id_Connect: string;
  nomUser: string = '';
  prenomUser: string = '';
  nbrReponse: number;
  nbrReponseCoche: number;
  promoUser: string = '';
  fantome: string = '';
  securiteUser: string = '';
  subscriptionTbCmp: Subscription = new Subscription();
  subscriptionEvent: Subscription = new Subscription();
  subscriptionVerificationCode: Subscription = new Subscription();
  totalPage: number = 0;
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;
  /* ATTENTION ....Cette partie des variables est complexe ECM..*/
  /*
  Ces variables sont des variables d'ecriture memoire qui me permetrons d'identifier les evenements
  et leur donnees chaque Event la fonction appelle va ecrire sur la variable aQui pour que apres le traitement
  de la verification du code on puis l'identifier et le rappeller pour passer a l'action..
   la fonction va aussi ecrire sur a variable id_Event pour apres rappelle de cette fonction
   on puisse la passé cette variable id_Event ...
*/
  aQui: string = '';
  id_Event?: string = '';
  constructor(
    private serviceBug: BugService,
    private authService: GardGuard,
    private dialog: MatDialog,
    private eventService: EmitEvent,
    private userService: UserService,
    private reponseBugService: ReponseBugService,
    private user: UserService,
    private route: Router,
    private _snackBar: MatSnackBar
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
        this.securiteUser = data_User.securite;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });
    //.....Initialisation, recuperation de la base de donne distant
    //this.serviceBug.recupbase();

    //...Subscription pour la recuperation du tbServiceBug
    this.subscriptionTbCmp = this.serviceBug.tbSubjectBugService.subscribe(
      (valuetb) => {
        this.tbCmpCh = this.tbCmp = valuetb ? valuetb : [];
        if (valuetb) {
          this.chargement = false;
        }

        this.totalPage = this.tbCmpCh.length;
      },
      (error) => {
        alert('erreur recup database !');
      }
    );
    this.serviceBug.updatetbBugService();
    //.................
    //Abonnement pour EventEmit de recupere les evennements ...
    //TODO
    this.subscriptionEvent = this.eventService.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        this.traintementEmitEvent(data_Event);
      }
    );

    //Subsciption Pour la verification du code
    //TODO
    this.subscriptionVerificationCode =
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          //Transmission des donnees a la methode traitement ...
          this.traitementSubcriptionCode(data_Event);
        }
      );
  }

  /*.....................................................................................*/
  //Methode pour le traitement des donnees de la subcription
  //TODO
  traitementSubcriptionCode(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VERIFICATION_CODE:
        //appelle pour la verification
        this.verifyReponseEvent(data_Event.data_paylode_Number);
        break;
    }
  }

  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  traintementEmitEvent(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VIEW_INFO_USER:
        this.onViewInfoUser(data_Event.data_paylode_String);
        break;
      case EventType.NAVIGATBUG:
        this.onNavigate(data_Event.data_paylode_String);
        break;
      case EventType.CHANGEETATBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'CHANGEETATBUG';
        this.id_Event = data_Event.data_paylode_String;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
      case EventType.NBR_REPONSE:
        this.onViewNbrReponse(data_Event.data_paylode_String);
        break;
      case EventType.UPDATEBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'UPDATEBUG';
        this.id_Event = data_Event.data_paylode_String;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
      case EventType.DELETEBUG:
        //on ecrit sur le variable memoires
        this.aQui = 'DELETEBUG';
        this.id_Event = data_Event.data_paylode_String;
        //appelle de la methode de verification
        this.onVerifyUser();
        break;
    }
  }
  //Traitement de la reponse du event code de verification ...
  verifyReponseEvent(reponse: any) {
    if (reponse == 1) {
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'CHANGEETATBUG':
          this.dialog.closeAll();
          this.onChangeEtatBug(this.id_Event);
          break;
        case 'UPDATEBUG':
          this.dialog.closeAll();
          this.onUpdateBug(this.id_Event);
          break;
        case 'DELETEBUG':
          this.dialog.closeAll();
          this.onDeletBug(this.id_Event);
          break;
      }
    } else {
      if (this.nbrTentative > 1) {
        --this.nbrTentative;
        const message = `Votre code est incorrect ! Veillez effacer et reprendre tentative (s) restante (s) ${this.nbrTentative}`;
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

  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.getAll();
        break;
      case 1:
        this.getMesPost();
        break;
      case 2:
        this.getResolu();
        break;
      case 3:
        this.getNonResolu();
        break;
      case 4:
        this.getModify();
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
          this.onChangeEtatBug(this.id_Event);
          break;
        case 'UPDATEBUG':
          this.onUpdateBug(this.id_Event);
          break;
        case 'DELETEBUG':
          this.onDeletBug(this.id_Event);
          break;
      }
    } else {
    }
  }
  //
  //......Voir les information du User
  //TODO
  onViewInfoUser(user_Id: any = '') {
    this.userService
      .getInfoUser(user_Id)
      .then((data_User) => {
        this.nomUser = data_User.nom;
        this.prenomUser = data_User.prenom;
        this.promoUser = data_User.promotion;
        this.fantome = data_User.fantome;
      })
      .catch((error) => {
        alert('Une erreur est survenue recup info User !');
      });
    //Netoyage des donnes avant d'afficher un autre appelle de viewInfoUser
    this.nomUser = '';
    this.prenomUser = '';
    this.promoUser = '';
    this.fantome = '';
  }
  //.....voir les details
  //TODO
  onNavigate(id_Bug: string = '') {
    this.serviceBug.onNavigate(id_Bug);
  }

  //Methode pour voir le nombre de reponses
  //TODO
  onViewNbrReponse(id_Bug: string = '') {
    this.nbrReponse = this.reponseBugService.verifyNbrReponse(id_Bug);
    this.nbrReponseCoche = this.reponseBugService.verifyCheckedReponse(id_Bug);
  }
  //Changer Etat
  //TODO
  onChangeEtatBug(id_Bug: string = '') {
    this.serviceBug.onChangeEtatBug(id_Bug);
  }

  //Methode Pour la modification du bug
  //TODO
  onUpdateBug(id_Bug: string = '') {
    this.serviceBug.navUpdateBug(id_Bug);
  }

  //Methode Pour la suppression du bug
  //TODO
  onDeletBug(id_Bug: string = '') {
    this.serviceBug.deleteBug(id_Bug);
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
    alert('component ecm detruite....');
    this.subscriptionTbCmp.unsubscribe();
    this.subscriptionEvent.unsubscribe();
    this.subscriptionVerificationCode.unsubscribe();

    console.log('subscription detruite');
  }
}
