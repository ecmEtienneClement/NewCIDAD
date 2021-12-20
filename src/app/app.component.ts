import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AppPlugingService } from './Mes_Services/appPlugin.Service';
import { AuthService } from './Mes_Services/auth.Service';
import { BugService } from './Mes_Services/bug.Service';
import { Notification } from './Mes_Services/notification.service';
import { ReponseBugService } from './Mes_Services/reponseBug.Service';

// typical import
import gsap from 'gsap';
//import { TextPlugin } from 'gsap/TextPlugin';

//gsap.registerPlugin(TextPlugin);
// or get other plugins:
//import ScrollTrigger from 'gsap/ScrollTrigger';
//import Draggable from 'gsap/Draggable';
import { EmitEvent } from './Mes_Services/emitEvent.service';
import { EventModel, EventType } from './Models/eventAction';
import { Subscription } from 'rxjs';
import { AppVideoService } from './Mes_Services/appVideo.Service';

import { GardGuard } from './Mes_Services/gard.guard';
import { LocalService } from './Mes_Services/local.Service';
import { UserService } from './Mes_Services/user.Service';
import { ErrorService } from './Mes_Services/error.Service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogueCodeComponent } from './MesComponents/alert-dialogue-code/alert-dialogue-code.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  //Variable animation active
  activePost: Boolean = true;
  activeVideo: Boolean = false;
  activePlugin: Boolean = false;
  activeSavePost: Boolean = false;
  activeSaveVideo: Boolean = false;
  activeSavePlugin: Boolean = false;
  activeConnexion: Boolean = false;
  activeInscription: Boolean = false;
  activeAide: Boolean = false;
  itemNavEnCour: string = 'post';
  animationInit: any;
  animationInitCaaled: Boolean = false;
  user_Connected: Boolean = false;
  //Info de qui est actuelement connecte
  nomUserConnected: string = '';
  prenomUserConnected: string = '';
  promoUserConnected: string = '';
  securiteUser: string = '';
  user_Id_Connect: string;
  //Variable pour les reglage d'annimation

  affichageParametreEcm: boolean = false;
  open_btn_details: boolean = false;
  open_btn: boolean = false;
  ligne_animation: boolean = true;
  affichageParametregeneral: boolean = false;
  open_btn_General: boolean = false;
  subscriptionEvent: Subscription = new Subscription();
  etatConnexionUser: boolean = false;
  //aQui me permet de savoir quel componnent a demandé l'affichage du paramtre open btn
  aQui: string = '';
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;
  constructor(
    private userService: UserService,
    private serviceAuth: AuthService,
    private route: Router,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private notifyService: Notification,
    private appPluginService: AppPlugingService,
    private appVideoService: AppVideoService,
    private eventService: EmitEvent,
    private localService: LocalService,
    private dialog: MatDialog,
    private _ngZone: NgZone,
    private errorAlertService: ErrorService
  ) {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyDWi460bDoITDItEHyUPKDLVUAegE-X7iE',
      authDomain: 'newcidad-7ed3e.firebaseapp.com',
      databaseURL:
        'https://newcidad-7ed3e-default-rtdb.europe-west1.firebasedatabase.app/',
      projectId: 'newcidad-7ed3e',
      storageBucket: 'newcidad-7ed3e.appspot.com',
      messagingSenderId: '918972046700',
      appId: '1:91;8972046700:web:761010701f87af75356749',
      measurementId: 'G-GK0DEWBCN9',
    };
    firebase.initializeApp(firebaseConfig);
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //gsap.to('.navbar-expand-sm', { y: 100, duration: 1 });
    firebase
      .database()
      .ref('.info/connected')
      .on('value', (data_Etat_Connexion) => {
        if (data_Etat_Connexion.val()) {
          this.etatConnexionUser = true;
          //Verification du User s'il est connecter
          //TODO
          firebase.auth().onAuthStateChanged((data_User: any) => {
            if (data_User) {
              //TODO
              this.user_Id_Connect = data_User.uid;
              //Recuperation des bugs depuis la base de donnee
              //TODO
              this.serviceBug.recupbase();
              //Recuperation des Reponses bugs depuis la base de donnee
              //TODO
              this.serviceReponseBug.recupeBaseReponse();
              //Recupration de la base de notification
              //TODO
              this.notifyService.recupbaseNotify();
              //Recupration de la base de AppPluging
              //TODO
              this.appPluginService.getAllPlugin();
              //Recupration de la base de AppVideo
              //TODO
              this.appVideoService.getAllVideo();
              //Initialisation du locale
              //TODO
              this.localService.initECM_Local();

              this.user_Connected = true;
              if (!this.animationInitCaaled) {
                this.animationInitCaaled = true;
                setTimeout(() => {
                  this.initAnim();
                }, 2000);
              }
              localStorage.setItem('ECM_UI_FB', data_User.uid);
              localStorage.setItem('ECM_UM', data_User.email);
              //recuperation des information du User Connected pour voir si son compte est securisé ou pas
              //TODO
              this.userService
                .getInfoUser(this.user_Id_Connect)
                .then((data_User) => {
                  this.nomUserConnected = data_User.nom;
                  this.prenomUserConnected = data_User.prenom;
                  this.promoUserConnected = data_User.promotion;
                  this.securiteUser = data_User.securite;
                })
                .catch(() => {
                  this.errorAlertService.notifyAlertErrorDefault(
                    "Une erreur inattendu ! l'or de la recupération de vos données ! Veillez actualiser ou vérifier votre connexion ..."
                  );
                });
            } else {
              this.user_Connected = false;

              this._ngZone.run(() => {
                this.route.navigate(['/connexion']);
              });
            }
          });
        } else {
          this.etatConnexionUser = false;
        }
      });

    //Abonnement pour EventEmit de recupere les evennements d'affichage...
    //TODO

    this.subscriptionEvent.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          /**ATTENDRE UNE SECONDE POUR EVITER CETTE ERREUR
           * Angular lance un ExpressionChangedAfterItHasBeenCheckedErrorlorsqu'une
           * valeur d'expression a été modifiée une fois la détection de changement
           */
          setTimeout(() => {
            this.traintementEmitEventAffichageParametre(data_Event);
          }, 1000);
        }
      )
    );
    //Abonnement pour EventEmit de recupere les evennements ...
    //TODO
    //event code
    this.subscriptionEvent.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          this.traintementEmitEventVerifyCode(data_Event);
        }
      )
    );
  }
  /******************************/
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
  //Traitement de la reponse du event code de verification ...
  verifyReponseEvent(reponse: any) {
    if (reponse == 1) {
      this.dialog.closeAll();
      this.onsignOut();
    } else {
      if (this.nbrTentative > 1) {
        --this.nbrTentative;
        this.errorAlertService.notifyAlertErrorDefault(
          `Votre code est incorrect ! tentative (s) restante (s) ${this.nbrTentative}`
        );
      } else {
        this.dialog.closeAll();
        this.errorAlertService.notifyAlertErrorDefault(
          'Veillez entrer votre email afin de reinitialiser votre code a 1234'
        );
        //Redirection apres nbrtentative atteint pour reinitialiser le code

        this.route.navigate(['/parametre']);
      }
    }
  }
  genereTokent() {
    alert('token');
  }
  //Methode pour la nav
  //TODO
  navSideNave(navParam: string) {
    this.route.navigate([navParam]);
  }
  traintementEmitEventAffichageParametre(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.AFFICHE_PARAMETRE_ECM:
        this.affichageParametreEcm = true;
        this.affichageParametregeneral = false;
        break;
      case EventType.AFFICHE_PARAMETRE_DT_ECM:
        this.aQui = 'detail ecm';
        this.affichageParametregeneral = true;
        this.affichageParametreEcm = false;
        break;
      case EventType.AFFICHE_PARAMETRE_VIDEO:
        this.aQui = 'video';
        this.affichageParametregeneral = true;
        this.affichageParametreEcm = false;
        break;
      case EventType.AFFICHE_PARAMETRE_PLUGIN:
        this.aQui = 'plugin';
        this.affichageParametregeneral = true;
        this.affichageParametreEcm = false;
        break;
      case EventType.FERMER_PARAMETRE_ECM:
        this.affichageParametreEcm = false;
        break;
      case EventType.CLOSE_BTN:
        this.affichageParametregeneral = false;
        this.open_btn_General = false;
        break;
    }
  }
  //Methode pour l'annimation du item active
  //TODO
  onActiveAnim(itemNavParam: string) {
    //Arret de item active en cour
    this.onDesactiveAnim();
    //variable memoire
    this.itemNavEnCour = itemNavParam;
    //Active de la nouvelle animation
    switch (itemNavParam) {
      case 'post':
        this.activePost = true;
        break;
      case 'video':
        this.activeVideo = true;
        break;
      case 'plugin':
        this.activePlugin = true;
        break;
      case 'savePost':
        this.activeSavePost = true;
        break;
      case 'saveVideo':
        this.activeSaveVideo = true;
        break;
      case 'savePlugin':
        this.activeSavePlugin = true;
        break;
      case 'aide':
        this.activeAide = true;
        break;
      case 'connexion':
        this.activeConnexion = true;
        break;
      case 'inscription':
        this.activeInscription = true;
        break;
    }
  }
  //Methode pour stoper l'ancien item active
  //TODO
  onDesactiveAnim() {
    switch (this.itemNavEnCour) {
      case 'post':
        this.activePost = false;
        break;
      case 'video':
        this.activeVideo = false;
        break;
      case 'plugin':
        this.activePlugin = false;
        break;
      case 'savePost':
        this.activeSavePost = false;
        break;
      case 'saveVideo':
        this.activeSaveVideo = false;
        break;
      case 'savePlugin':
        this.activeSavePlugin = false;
        break;
      case 'aide':
        this.activeAide = false;
        break;
      case 'connexion':
        this.activeConnexion = false;
        break;
      case 'inscription':
        this.activeInscription = false;
        break;
    }
  }

  /** .................Emmission des events PARAMETRE D'AFFICHAGE .......... */

  //TODO
  onOpenBtnDetails() {
    this.open_btn_details = !this.open_btn_details;
    this.eventService.emit_Event_Update_({
      type: EventType.OPEN_BTN_DETAILS,
    });
  }
  //TODO
  openBlocBtn() {
    this.open_btn = !this.open_btn;
    this.eventService.emit_Event_Update_({
      type: EventType.OPEN_BLOC_BTN,
    });
  }
  //TODO
  ligneAnimation() {
    this.ligne_animation = !this.ligne_animation;
    this.eventService.emit_Event_Update_({
      type: EventType.ANIMATION_LIGNES,
    });
  }
  //TODO
  openBtn() {
    this.open_btn_General = !this.open_btn_General;
    this.eventService.emit_Event_Update_({
      type: EventType.OPEN_BTN,
      data_paylode_String: this.aQui,
    });
  }

  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser() {
    if (this.securiteUser == 'true') {
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUser == 'false') {
      let confirmationDelete: boolean = confirm(
        'Confirmez-vous la déconnexion'
      );
      if (confirmationDelete) this.onsignOut();
    }
  }
  //Methode pour la deconnexion
  //TODO
  onsignOut() {
    this.user_Connected = false;
    this.serviceAuth.signOutUser();
  }
  //Methode pour animation initiale
  //TODO
  initAnim() {
    this.animationInit = gsap.timeline();
    this.animationInit.from('.nav-item', {
      ease: 'back',
      y: -100,
      stagger: 0.2,
      duration: 0.9,
      repeat: -1,
      repeatDelay: 30,
    });
  }
  //Methode pour animation sideNav
  //TODO
  animSideNav() {
    this.animationInit = gsap.timeline();
    this.animationInit.from('.list-group-item', {
      ease: 'back',
      x: -200,
      stagger: 0.2,
      duration: 0.9,
    });
  }
  //Methode pour la demande de code
  //TODO
  openDialog() {
    this.dialog.open(AlertDialogueCodeComponent);
  }
  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
  }
}
