import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { BugModel } from 'src/app/Models/bug';
import { EventModel, EventType } from 'src/app/Models/eventAction';

@Component({
  selector: 'app-cpmdetails',
  templateUrl: './cpmdetails.component.html',
  styleUrls: ['./cpmdetails.component.css'],
})
export class CpmdetailsComponent implements OnInit {
  indiceCodeBug: number = 0;
  //le info de celui qui a poste ce bug
  nomUserBug: string = '';
  prenomUserBug: string = '';
  promoUserBug: string = '';
  //Info de qui est actuelement connecte
  nomUserConnected: string = '';
  prenomUserConnected: string = '';
  //Info du user qui a reponde a cette poste
  nomUserReponse: string = '';
  prenomUserReponse: string = '';
  promoUserReponse: string = '';
  fantomeReponse: boolean = true;
  //stocker des donnees dans le champs saisi
  reponse: string = '';
  //Intialisation des info du bug
  bugCmp: any = new BugModel('id', '', '', '', '', '', 0, Date.now(), ['']);
  //tbReponseCmp: any;
  indice: number;
  tbGeneralDBReponseBug: any = [];
  tbReponseBug: any = [];
  totalPage: number = 0;

  subscriptionEvent: Subscription = new Subscription();
  subscriptionTbReponse: Subscription = new Subscription();
  user_Id_Connect: string;
  user_Id_Bug: string;

  constructor(
    private extra: ActivatedRoute,
    private eventEmit: EmitEvent,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private authService: GardGuard,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id Qui est connecter pour le texte UNE SOLUTION {{nomuser}}
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    this.userService
      .getInfoUser(this.user_Id_Connect)
      .then((data_User) => {
        this.nomUserConnected = data_User.nom;
        this.prenomUserConnected = data_User.prenom;
      })
      .catch((error) => {
        alert('Une erreur de connexion ...! ');
        this.nomUserConnected = 'Fantom';
        this.prenomUserConnected = 'Fantom';
      });
    //...Recuperation de l'indice via l'url
    //TODO
    this.indice = this.extra.snapshot.params['indice'];

    //.......Recuperation du soloBug
    //TODO
    // this.serviceBug.recupbase();
    this.serviceBug
      .recupbaseSoloBug(this.indice)
      .then((data_value: any) => {
        this.bugCmp = data_value;
        this.user_Id_Bug = data_value.user_Id;
        //  console.log('call by subsBug .....');
        //Apelle de la methode filtre suite a l'arrivees des donnees ...
        this.filterTbReponse();
        //Recuperation des info du user qui a poster ce bug ...via son ID
        this.userService
          .getInfoUser(this.user_Id_Bug)
          .then((data_User) => {
            this.nomUserBug = data_User.nom;
            this.prenomUserBug = data_User.prenom;
            this.promoUserBug = data_User.promotion;
          })
          .catch((error) => {
            alert('Une erreur de connexion ...! ');
          });
      })
      .catch((error) => {
        alert('Une erreur est survenue recup Bug ...!');
        console.log('Une erreur est survenue recup bug ==>' + error);
      });
    ///Recuperation du tbReponsesBug dans base de donnee ..
    //TODO
    //  this.serviceReponseBug.recupeBaseReponse();
    //Abonnement pour recuperer le TbBug ...
    this.subscriptionTbReponse =
      this.serviceReponseBug.tbsubjectReponse.subscribe(
        (data_Value) => {
          //Recuperation du tbGeneral de la base de donnee
          //  this.tbGeneralDBReponseBug = data_Value ? data_Value : [];
          this.tbGeneralDBReponseBug = this.tbReponseBug = data_Value
            ? data_Value
            : [];

          this.totalPage = this.tbReponseBug.length;
          //   console.log('call by substbReponse .....');
          //Apelle de la methode filtre suite a l'arrivees des donnees ...
          this.filterTbReponse();
        },
        (error) => {
          alert('Une erreur est survenue recup base reponse !');
        }
      );
    //Update tbReponse
    //TODO
    this.serviceReponseBug.updateTbReponseBug();
    //Abonnement pour les EventEmit evennements  ...
    //TODO
    this.subscriptionEvent = this.eventEmit.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        this.traintementEmitEvent(data_Event);
      }
    );
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

    //console.log('length ' + this.tbGeneralDBReponseBug.length);
    //page total pour la pagination
    this.totalPage = this.tbReponseBug.length;
  }

  //.....
  //...Enregistrement de la reponse Bug ...
  //TODO
  onSubmitForm() {
    this.serviceReponseBug.creatNewReponseBug(
      this.bugCmp.bug_Id,
      this.reponse,
      this.bugCmp.user_Id,
      this.bugCmp.titre
    );
    this.reponse = '';
  }
  //...Suppression de la reponse Bug ...
  //TODO
  onResetForm() {
    this.reponse = '';
  }
  //.........
  /*
   Verification de l'evenement afin de le traite avec la bonne methode ..
   ..................TRAITEMENT DES EVENEMENTS ..................
 */

  //TODO
  traintementEmitEvent(event: EventModel) {
    switch (event.type) {
      case EventType.VIEW_INFO_USER:
        this.onViewInfoUser(event.data_paylode_String);
        break;
      case EventType.COMMENTER__REPONSE_BUG:
        this.onCommenter(
          event.data_paylode_String,
          event.data_paylode_Donnee_String
        );
        break;
      case EventType.CHEKED_REPONSE_BUG:
        this.onCheckReponseBug(event.data_paylode_String);
        break;
      case EventType.DELETE_REPONSE_BUG:
        this.onDeleteReponseBug(event.data_paylode_String);
        break;
    }
  }

  /*
  
   .............................TRAITEMENT DES METHODES ................. ..................
 */

  //......Voir les information du User
  //TODO
  onViewInfoUser(user_Id: any = '') {
    this.userService
      .getInfoUser(user_Id)
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
  //Methode pour Checked la reponse bug
  //TODO
  onCheckReponseBug(id_Reponse: string = '') {
    const isCheked: boolean =
      this.serviceReponseBug.onCheckReponseBug(id_Reponse);

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
  onCommenter(id_Reponse: string = '', commentaire?: string) {
    this.serviceReponseBug.addCommentaireReponseBug(id_Reponse, commentaire);
  }
  //Methode pour supprimer la reponse bug
  //TODO
  onDeleteReponseBug(id_Reponse: string = '') {
    this.serviceReponseBug.DeleteReponseBug(id_Reponse);
  }

  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
    this.subscriptionTbReponse.unsubscribe();
    alert('detail detruite');
    console.log('subscriptionEvent détruite ...');
    console.log('subscriptionTbReponse détruite ...');
  }
}
