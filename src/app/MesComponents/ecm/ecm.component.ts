import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { BugModel } from 'src/app/Models/bug';
import { ModelVueDialogComponent } from '../model-vue-dialog/model-vue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';

import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';

@Component({
  selector: 'app-ecm',
  templateUrl: './ecm.component.html',
  styleUrls: ['./ecm.component.css'],
})
export class EcmComponent implements OnInit, OnDestroy {
  tbCmp: BugModel[] | any;
  tbCmpMesPostes: BugModel[] | any;
  tbCmpResolu: BugModel[] | any;
  tbCmpNonResolu: BugModel[] | any;
  tbCmpCh: BugModel[] | any;
  chargement: boolean = true;
  user_Id_Connect: string;
  nomUser: string = '';
  prenomUser: string = '';
  promoUser: string = '';
  fantome: boolean = true;
  subscriptionTbCmp: Subscription = new Subscription();
  subscriptionEvent: Subscription = new Subscription();
  totalPage: number = 0;

  constructor(
    private serviceBug: BugService,
    private authService: GardGuard,
    private dialog: MatDialog,
    private eventService: EmitEvent,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    //.....Initialisation, recuperation de la base de donne distant
    //this.serviceBug.recupbase();

    //...Subscription pour la recuperation du tbServiceBug
    this.subscriptionTbCmp = this.serviceBug.tbSubjectBugService.subscribe(
      (valuetb) => {
        this.tbCmpCh = this.tbCmp = valuetb ? valuetb : [];
        this.chargement = this.tbCmp.length !== 0 ? false : true;
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
  }

  /*
  
  */

  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  traintementEmitEvent(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VIEW_INFO_USER:
        this.onViewInfoUser(data_Event.data_paylode_String);
        break;
      case EventType.NAVIGATBUG:
        this.onNavigate(
          data_Event.data_paylode_Number,
          data_Event.data_paylode_PageNavigate
        );
        break;
      case EventType.CHANGEETATBUG:
        this.onChangeEtatBug(
          data_Event.data_paylode_Number,
          data_Event.data_paylode_PageNavigate
        );
        break;
      case EventType.UPDATEBUG:
        this.onUpdateBug(
          data_Event.data_paylode_Number,
          data_Event.data_paylode_PageNavigate
        );
        break;
      case EventType.DELETEBUG:
        this.onDeletBug(
          data_Event.data_paylode_Number,
          data_Event.data_paylode_PageNavigate
        );
        break;
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

  openDialog() {
    this.dialog.open(ModelVueDialogComponent);
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
    //Netoyage des donnes avec d'afficher un autre appelle de viewInfoUser
    this.nomUser = '';
    this.prenomUser = '';
    this.promoUser = '';
  }
  //.....voir les details
  //TODO
  onNavigate(indice: number, page: number = 1) {
    //Traitement de la valeur de i voir commentaire ECM
    indice += 4 * (page - 1);
    //Recuperation de son ID
    const id_Bug = this.tbCmpCh[indice].bug_Id;
    this.serviceBug.onNavigate(id_Bug);
  }
  //Changer Etat
  //TODO
  onChangeEtatBug(indice: number, page: number = 1) {
    /*
  ...........  ETIENNE CLEMENT MBAYE RAPPELLE TOI DE i ............
    Traitement delicate pour la modification de l'etat bug ......
    d'abort au de la de chaque page de pagination i sera initialisez par 0
    plus claire pour la page 1 i aura une valeure normale donc faire this.tbCmpCh[i] te renvera
    le bon element a modifier mais si on allez a la page suivant i sera initialiser a 0
    par consequent faire this.tbCmpCh[i] te renvera pas l'element cible car i a changer et
    que dans le tableau this.tbCmpCh l'element cible garde son indice pour resoudre le blem
    j'ai mis en place un system de remise de la valeur de i apres initialisation la formule est
       i += itemsPerPage * (page-1) ......ETIENNE C'EST QUOI CA........
       bien d'abord:
      --- +=   ban....haaaa ca c pour nous les programmeurs.....
      --- itemsPerPage est le nbr d'element a affiche dans chaque page
      --- et page est la page courant ou est l'utilisateur
          EXPEMPLE : itemsPerPage =10 , page = 2 , tbCmpCh[].length = 13
          on veut cible element indice = 11 donc i sera egale a 1 ---haahaa ne me demande pas 
          comment j'ai fait pour touver i ....bien
      RESULTAT : 1 += 10 * (2-1) ===> 1 += 10 *1  ===> i = 11
      DONC FAIRE this.tbCmpCh[i] me renvera le bon element --------GOOD-------ECM-------
  */
    //Traitement de la valeur de i voir commentaire ECM
    indice += 4 * (page - 1);
    //Recuperation de son ID
    const id_Bug = this.tbCmpCh[indice].bug_Id;
    this.serviceBug.onChangeEtatBug(id_Bug);
  }
  //Methode Pour la modification du bug
  //TODO
  onUpdateBug(indice: number, page: number = 1) {
    indice += 4 * (page - 1);
    //Recuperation de son ID
    const id_Bug = this.tbCmpCh[indice].bug_Id;
    this.serviceBug.navUpdateBug(id_Bug);
  }

  //Methode Pour la suppression du bug
  //TODO
  onDeletBug(indice: number, page: number = 1) {
    //Traitement de la valeur de i voir commentaire ECM
    indice += 4 * (page - 1);
    //Recuperation de son ID
    const id_Bug = this.tbCmpCh[indice].bug_Id;
    this.serviceBug.deleteBug(id_Bug);
  }
  //......
  ngOnDestroy(): void {
    alert('component ecm detruite....');
    this.subscriptionTbCmp.unsubscribe();
    this.subscriptionEvent.unsubscribe();
    console.log('subscription detruite');
  }
}
