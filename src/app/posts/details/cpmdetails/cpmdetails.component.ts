import { Component,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { BugModel } from 'src/app/Models/bug';
import {
  EventModel,
  EventModelObjReponse,
  EventType,
} from 'src/app/Models/eventAction';
import { NotificationModel } from 'src/app/Models/notification';
import { ReponseBugModel } from 'src/app/Models/reponseBug';
import gsap from 'gsap';
@Component({
  selector: 'app-cpmdetails',
  templateUrl: './cpmdetails.component.html',
  styleUrls: ['./cpmdetails.component.css'],
})
export class CpmdetailsComponent implements OnInit {
  tbBlocks: string[] = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',

  ];
 
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnRepondre: boolean = false;
  tbViewUser: boolean[] = [];
  tbSignalUserCommentaire: boolean[] = [];
  tbViewUserCommentaire: boolean[] = [];
  tbViewUserCharged: boolean = false;
  tbSignalUserCharged: boolean = false;
  tbViewSignalUserCharged: boolean = false;
  indiceCodeBug: number = 0;
  //le info de celui qui a poste ce bug
  nomUserBug: string = '';
  prenomUserBug: string = '';
  promoUserBug: string = '';
  fantomeUserBug: string = '';
  //Info de qui est actuelement connecte
  nomUserConnected: string | null = '';
  prenomUserConnected: string | null = '';
  promoUserConnected: string | null = '';
  fantomeUserConnected: string | null = '';
  securiteUserConnected: string | null = '';
  //Info du user qui a repondu a cette poste
  nomUserReponse: string = '';
  prenomUserReponse: string = '';
  promoUserReponse: string = '';
  fantomeReponse: string = '';
  //stocker des donnees dans le champs saisi
  reponse: string = '';
  //Intialisation des info du bug
  bugCmp: BugModel = new BugModel('id', '', '', '', '', '', 0, Date.now(), [
    '',
  ]);
  //tbReponseCmp: any;
  indice: number;
  tbGeneralDBReponseBug: any = [];
  tbReponseBug: ReponseBugModel[] = [];
  totalPage: number = 0;
  nbrTentative: number = 3;
  subscription: Subscription = new Subscription();
  user_Id_Connect: string;
  user_Id_Bug: string;
  aQui: string = '';
  page_Event?: number = 1;
  id_Event?: string = '';
  obj_Event: ReponseBugModel;
  number_Event?: number;
  // cette variable nous permert d'arrete la boucle de l'anim gsap entete user cas ou le user qui
  // la page sans que la boucle n'est achever
  continu: boolean = true;
  constructor(
    private extra: ActivatedRoute,
    private eventEmit: EmitEvent,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private authService: GardGuard,
    private userService: UserService,
    private notifyService: Notification,
    private dialog: MatDialog,
    private route: Router,
    private _snackBar: MatSnackBar,
    private alertErrorDefaultService: ErrorService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.animCardUser();
    }, 2000);

    //Recuperation du User_Id Qui est connecter pour le texte UNE SOLUTION {{nomuser}}et pour les commentaires passage de ses informations
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    this.userService.VerifyLocaleStorage().then((data_ObjUser) => {
      this.nomUserConnected = data_ObjUser.nom;
      this.prenomUserConnected = data_ObjUser.prenom;
      this.promoUserConnected = data_ObjUser.promotion;
      this.fantomeUserConnected = data_ObjUser.fantome;
      this.securiteUserConnected = data_ObjUser.securite;
    });

    //Mise en place de la subscription pour le tbNotify...
    //TODO
    this.subscription.add(
      this.notifyService.tbNotifySubject.subscribe(
        (data_db_Notify: NotificationModel[]) => {
          //Des que les tbDbNotify arriver je lance la methode de filtre
          if (data_db_Notify) {
            //on marque immediatement vue au message et commentaire si le user est en ligne
            if (this.bugCmp.bug_Id != '') {
              this.serviceBug.onViewNewReponseAndCommentaireOnlyne(this.bugCmp);
            }
            //todo
            //  this.nbrTotalNotify = tbFilterByIdNotify[0].nbrTotalNotify;
          }
        },
        () => {
          alert('Erreur recup Notify Veiller actualisée');
        }
      )
    );
    this.notifyService.emitUpdateTbNotify();
    //...Recuperation de l'indice via l'url
    //TODO
    this.indice = this.extra.snapshot.params['indice'];
    //.......Recuperation du soloBug
    //TODO
    // this.serviceBug.recupbase();
    this.serviceBug
      .recupbaseSoloBug(this.indice)
      .then((data_value: any) => {
        if (data_value == null) {
          alert("Cet post n'existe pas !");
          this.route.navigate(['/ecm']);
        } else {
          this.bugCmp = data_value;
          this.user_Id_Bug = data_value.user_Id;
          //  console.log('call by subsBug .....');
          //Apelle de la methode filtre suite a l'arrivees des donnees ...
          this.filterTbReponse();

          //Recuperation des info du user qui a poster ce bug ...via son ID
          if (data_value) {
            this.userService
              .getInfoUser(this.user_Id_Bug)
              .then((data_User) => {
                this.nomUserBug = data_User.nom;
                this.prenomUserBug = data_User.prenom;
                this.promoUserBug = data_User.promotion;
                this.fantomeUserBug = data_User.fantome;
              })
              .catch(() => {
                alert(
                  'Une erreur est survenue ! Veiller vérifier votre connexion  ...!'
                );
              });
          }
        }
      })
      .catch(() => {
        this.alertErrorDefaultService.notifyAlertErrorDefault();
      });
    ///Recuperation du tbReponsesBug dans base de donnee ..
    //TODO
    //  this.serviceReponseBug.recupeBaseReponse();
    //Abonnement pour recuperer le TbBug ...
    this.subscription.add(
      this.serviceReponseBug.tbsubjectReponse.subscribe(
        (data_Value) => {
          if (data_Value) {
            //Recuperation du tbGeneral de la base de donnee
            //  this.tbGeneralDBReponseBug = data_Value ? data_Value : [];
            this.tbGeneralDBReponseBug = this.tbReponseBug = data_Value
              ? data_Value
              : [];

            this.totalPage = this.tbReponseBug.length;
            //   console.log('call by substbReponse .....');
            //Apelle de la methode filtre suite a l'arrivees des donnees ...
            this.filterTbReponse();
          }
        },
        () => {
          alert('Une erreur est survenue recup base reponse !');
        }
      )
    );
    //Update tbReponse
    //TODO
    this.serviceReponseBug.updateTbReponseBug();
    //Abonnement pour les EventEmitObjReponse evennements  ...
    //TODO
    this.subscription.add(
      this.eventEmit.emitEventSubjectObjReponse.subscribe(
        (data_Event_Obj_Reponse: EventModelObjReponse) => {
          this.traintementEmitEvent(data_Event_Obj_Reponse);
        }
      )
    );
    //Subsciption Pour la verification du code
    //TODO
    this.subscription.add(
      this.eventEmit.emitEventSubjectBug.subscribe((data_Event: EventModel) => {
        //Transmission des donnees a la methode traitement ...
        this.traitementSubcriptionCode(data_Event);
      })
    );
  }

  traintementEmit(data_Event: EventModelObjReponse) {
    this.onCheckReponseBug(data_Event.data_paylode_obj_Reponse);
  }
  /**.................................................................................. */
  //Ces Methodes change l'indice du tb de code Bug
  //TODO
  onCodeBug1() {
    this.indiceCodeBug = 0;
  }
  onCodeBug2() {
    this.indiceCodeBug = 1;
  }
  onCodeBug3() {
    this.indiceCodeBug = 2;
  }

  //Filtrage du tbReponse pour afficher les reponses concernant a ce bug par ID
  //Cette fontion sera appeller  au moin deux fois car elle est constituer de deux elements
  //asynchrones pour le filtrage du tb qui sont le tbReponse et bugCmp.bug_Id
  //TODO
  filterTbReponse() {
    this.tbReponseBug =
      this.tbGeneralDBReponseBug.filter(
        (reponse: { bug_Id: string }) => reponse.bug_Id == this.bugCmp.bug_Id
      ).length != 0
        ? this.tbGeneralDBReponseBug.filter(
            (reponse: { bug_Id: string }) =>
              reponse.bug_Id == this.bugCmp.bug_Id
          )
        : [];
    if (this.tbReponseBug.length == 0) {
      this.serviceBug.onVerifyChangeEtatBug(this.bugCmp.bug_Id);
    }
    //page total pour la pagination
    this.totalPage = this.tbReponseBug.length;
    //Appelle de la methode de view pour charger le tbViewUser
    this.verifyViewUserPaginate(this.page_Event);
    this.verifySignaleUserCommentairePaginate(this.page_Event);
    this.verifyViewSignaleUserCommentairePaginate(this.page_Event);
  }
  //...Enregistrement de la reponse Bug ...
  //TODO
  onSubmitForm() {
    this.diseableBtnRepondre = true;
    this.serviceReponseBug.creatNewReponseBug(
      this.bugCmp.bug_Id,
      this.reponse,
      this.bugCmp.user_Id,
      this.bugCmp.titre
    );
    this.reponse = '';
    //Notification de new Reponse a Bug Pour afficher l'alert au post
    //si celui qui commente est different du proprietaire du post
    if (this.user_Id_Connect != this.bugCmp.user_Id) {
      this.serviceBug.notifyNewReponseAlert(this.bugCmp.bug_Id);
    }
    this.diseableBtnRepondre = false;
  }
  //...Suppression de la reponse Bug ...
  //TODO
  onResetForm() {
    this.reponse = '';
  }
  /*
   Verification de l'evenement afin de le traite avec la bonne methode ..
   ..................TRAITEMENT DES EVENEMENTS ..................
 */
  //TODO
  traintementEmitEvent(event: EventModelObjReponse) {
    switch (event.type) {
      case EventType.VIEW_INFO_USER:
        this.onViewInfoUser(event.data_paylode_obj_Reponse);
        break;
      case EventType.CHANGE_PAGINATE:
        if (event.data_paylode_String === 'detail ecm') {
          this.page_Event = event.data_paylode_Number;
          this.verifyViewUserPaginate(event.data_paylode_Number);
          this.verifySignaleUserCommentairePaginate(event.data_paylode_Number);
          this.verifyViewSignaleUserCommentairePaginate(
            event.data_paylode_Number
          );

          break;
        }
        break;
      case EventType.VIEW_REPONSE_BUG:
        this.ViewReponseBug(event.data_paylode_obj_Reponse);
        break;
      case EventType.VIEW_COMMENTAIRE_REPONSE_BUG:
        this.ViewCommentaireReponseBug(event.data_paylode_obj_Reponse);
        break;
      case EventType.COMMENTER__REPONSE_BUG:
        this.onCommenter(
          event.data_paylode_obj_Reponse,
          event.data_paylode_String
        );
        break;
      case EventType.CHEKED_REPONSE_BUG:
        //on ecrit sur le variable memoires
        this.aQui = 'CheckReponseBug';
        this.obj_Event = event.data_paylode_obj_Reponse;
        this.onVerifyUser();
        break;
      case EventType.DELETE_COMMENTAIRE_REPONSE_BUG:
        this.aQui = 'DeleteCommentaireReponseBug';
        this.obj_Event = event.data_paylode_obj_Reponse;
        this.number_Event = event.data_paylode_Number;
        this.onVerifyUser();
        break;
      case EventType.DELETE_REPONSE_BUG:
        //on ecrit sur le variable memoires
        this.aQui = 'DeleteReponseBug';
        this.obj_Event = event.data_paylode_obj_Reponse;
        this.onVerifyUser();
        break;
    }
  }
  //Methode pour Verifier si le user a deja pas vu ce message
  //TODO
  verifyViewUserPaginate(pageIndex: number = 1) {
    /*Bien ! avec la pagination les index vont changer exp si a la page 2..et autre
     *les bug vont changer d'index pour resoudre ce probleme on redefini le tbView a
     *l'aide de l'index
     */
    pageIndex = 10 * (pageIndex - 1);
    this.tbViewUserCharged = false;
    this.tbViewUser = [];
    if (this.user_Id_Connect != '') {
      this.tbReponseBug.forEach((element) => {
        const indexElement: number = this.tbReponseBug.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.tbViewUser.includes(this.user_Id_Connect)) {
            this.tbViewUser.push(true);
          } else {
            this.tbViewUser.push(false);
          }
        }
      });
      this.tbViewUserCharged = true;
    } else {
      this.alertErrorDefaultService.notifyAlertErrorDefault();
    }
  }
  //Methode pour Verifier si le user a deja pas vu ce message
  //TODO
  verifySignaleUserCommentairePaginate(pageIndex: number = 1) {
    //Lire le commentaire dessus de VerifyViewUserPaginate...
    pageIndex = 10 * (pageIndex - 1);
    this.tbSignalUserCharged = false;
    this.tbSignalUserCommentaire = [];

    if (this.user_Id_Connect != '') {
      this.tbReponseBug.forEach((element) => {
        const indexElement: number = this.tbReponseBug.indexOf(element);
        if (indexElement >= pageIndex) {
          //verifier si le user fait parti  de ce qui ont commenté...
          if (element.tbcommentaireUser.includes(this.user_Id_Connect)) {
            this.tbSignalUserCommentaire.push(true);
          } else {
            this.tbSignalUserCommentaire.push(false);
          }
        }
      });
      this.tbSignalUserCharged = true;
    } else {
      this.alertErrorDefaultService.notifyAlertErrorDefault();
    }
  }
  //Methode pour Verifier si le user a deja pas vu ce message
  //TODO
  verifyViewSignaleUserCommentairePaginate(pageIndex: number = 1) {
    //Lire le commentaire dessus de VerifyViewUserPaginate...
    pageIndex = 10 * (pageIndex - 1);
    this.tbViewSignalUserCharged = false;
    this.tbViewUserCommentaire = [];
    if (this.user_Id_Connect != '') {
      this.tbReponseBug.forEach((element) => {
        const indexElement: number = this.tbReponseBug.indexOf(element);
        if (indexElement >= pageIndex) {
          //verifier si le user fait parti  de ce qui ont commenté ...
          if (element.tbViewcommentaireUser.includes(this.user_Id_Connect)) {
            this.tbViewUserCommentaire.push(true);
          } else {
            this.tbViewUserCommentaire.push(false);
          }
        }
      });
      this.tbViewSignalUserCharged = true;
    } else {
      this.alertErrorDefaultService.notifyAlertErrorDefault();
    }
  }
  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser() {
    if (this.securiteUserConnected == 'true') {
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUserConnected == 'false') {
      //Passe directement a la suppression si le user n'a pas securiser son compte
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'CheckReponseBug':
          this.onCheckReponseBug(this.obj_Event);
          break;
        case 'DeleteReponseBug':
          this.onDeleteReponseBug(this.obj_Event);
          break;
        case 'DeleteCommentaireReponseBug':
          let confirmationDelete: boolean = confirm(
            'Confirmez-vous la suppression'
          );
          if (confirmationDelete) {
            this.deleteCommentaire(this.obj_Event, this.number_Event);
            break;
          }
      }
    }
  }
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
  //Traitement de la reponse du event code de verification ...
  //TODO
  verifyReponseEvent(reponse: any) {
    if (reponse == 1) {
      this.dialog.closeAll();
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'DeleteReponseBug':
          this.onDeleteReponseBug(this.obj_Event);
          break;
        case 'CheckReponseBug':
          //  this.onCheckReponseBug(this.obj_Event);
          break;
        case 'DeleteCommentaireReponseBug':
          this.deleteCommentaire(this.obj_Event, this.number_Event);
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
  /*
   .............................TRAITEMENT DES METHODES ................. ..................
  */

  //Methode pour copier le code du bug
  //TODO
  onCopyCodeBug(txtCodeBug: string) {
    navigator.clipboard.writeText(txtCodeBug);
    let instanceT = gsap.timeline();
    instanceT.to(`.txtCopyCodeBug`, {
      opacity: 1,
      duration: 1,
    });
    setTimeout(() => {
      instanceT.reversed(true);
    }, 2000);
  }
  //......Voir les information du User
  //TODO
  onViewInfoUser(objReponse: ReponseBugModel) {
    this.userService
      .getInfoUser(objReponse.user_Id)
      .then((data_User) => {
        this.nomUserReponse = data_User.nom;
        this.prenomUserReponse = data_User.prenom;
        this.promoUserReponse = data_User.promotion;
        this.fantomeReponse = data_User.fantome;
      })
      .catch((error) => {
        alert('Une erreur est survenue recup info User !');
      });
    //Netoyage des donnes avec d'afficher un autre appelle de viewInfoUser
    this.nomUserReponse = '';
    this.prenomUserReponse = '';
    this.promoUserReponse = '';
  }
  //.marquer vue a la reponse
  //TODO
  ViewReponseBug(objReponse: ReponseBugModel) {
    let userView: boolean = this.serviceReponseBug.onViewReponse(objReponse);
    if (userView) {
      this.verifyViewUserPaginate(this.page_Event);
    }
  }
  //.marquer vue au commentaire de la reponse
  //TODO
  ViewCommentaireReponseBug(objReponse: ReponseBugModel) {
    //On verifie d'abord s'il fait partie de ceux qui on commenté
    if (objReponse.tbcommentaireUser.includes(this.user_Id_Connect)) {
      let userView: boolean =
        this.serviceReponseBug.onViewUserCommentaire(objReponse);
      if (userView) {
        this.verifyViewUserPaginate(this.page_Event);
      }
    }
  }
  //Methode pour Checked la reponse bug
  //TODO
  onCheckReponseBug(obj_Reponse: ReponseBugModel) {
    const isCheked: boolean =
      this.serviceReponseBug.onCheckReponseBug(obj_Reponse);

    if (isCheked) {
      //Changement de l'etat si ce n'est pas Resolu ...
      this.serviceBug.onChangeEtatBugByCheckedIsTrue(this.bugCmp.bug_Id);
      /*Changement de l'etat visuel du bug car ce bug a ete recupere par solo bug
       onChangeEtatBugByCheckedIsTrue fera le changement c bien mais ne pour pas mettre
       a jour l'etat automatiquement il faudrai que le user sort et revient pour qu'il affiche
       resolu maintenant pour le faire d'une maniere automatique je modifier en meme temps
       l'etat du bug solo pour que le changement soit automatique au yeusx du user
      */
      this.bugCmp.etat = 'Résolu';
    } else {
      //Verification si il n'y pas dabord une reponse cochée merci avant de modifier l'etat
      const changementEtatBugCmpSolo: boolean =
        this.serviceBug.onChangeEtatBugByCheckedIsFalse(this.bugCmp.bug_Id);
      //Changement de l'etat du bugCmp apres verificarion du changementEtatBugCmpSolo
      if (changementEtatBugCmpSolo) {
        this.bugCmp.etat = 'Non Résolu';
      }
    }
  }
  //Ajout du commentaire dans le tbcommentaire de la reponse ...
  //TODO
  onCommenter(objReponse: ReponseBugModel, commentaire?: string) {
    this.serviceReponseBug
      .addCommentaireReponseBug(
        objReponse,
        commentaire,
        this.nomUserConnected,
        this.prenomUserConnected,
        this.promoUserConnected,
        this.fantomeUserConnected,
        this.bugCmp.user_Id
      )
      .then((objReponseReturn: ReponseBugModel) => {
        //Notification de new commentaire du Bug Pour afficher l'alert au post a tt les concerné

        this.serviceBug.notifyNewCommentaireAlert(objReponseReturn);
      });
  }
  //Methode pour supprimer un commentaire d'une reponse
  //TODO
  deleteCommentaire(
    objReponse: ReponseBugModel,
    dateCommentaireDelete?: number
  ) {
    this.serviceReponseBug.deleteCommentaire(objReponse, dateCommentaireDelete);
  }
  //Methode pour supprimer la reponse bug
  //TODO
  onDeleteReponseBug(objReponse: ReponseBugModel) {
    this.serviceReponseBug.DeleteReponseBug(objReponse);
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
  //Methode pour l'animation de l'entete initiale
  //TODO
  animCardUser() {
    let instanceT = gsap.timeline();
    instanceT.to(`.container .alert .banner`, {
      backgroundColor: 'transparent',
      duration: 1,
    });
    instanceT.to(`.container .alert .banner .blocks`, {
      backgroundColor: 'transparent',
      duration: 0.5,
      stagger: 0.1,
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
