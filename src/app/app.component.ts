import { Component, OnDestroy, OnInit } from '@angular/core';
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

// or get other plugins:
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import { EmitEvent } from './Mes_Services/emitEvent.service';
import { EventModel, EventType } from './Models/eventAction';
import { Subscription } from 'rxjs';
import { AppVideoService } from './Mes_Services/appVideo.Service';

import { GardGuard } from './Mes_Services/gard.guard';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  user_Connected: Boolean = false;

  //Info de qui est actuelement connecte
  nomUserConnected: string = '';
  prenomUserConnected: string = '';
  promoUserConnected: string = '';
  modeNaveUserConnected: string = '';
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
  constructor(
    private serviceAuth: AuthService,
    private route: Router,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private notifyService: Notification,
    private appPluginService: AppPlugingService,
    private appVideoService: AppVideoService,
    private eventService: EmitEvent,

    private authGard: GardGuard
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
      appId: '1:918972046700:web:761010701f87af75356749',
      measurementId: 'G-GK0DEWBCN9',
    };
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit(): void {
    //TODO
    this.user_Id_Connect = this.authGard.user_Id_Connect;
    //gsap.to('.navbar-expand-sm', { y: 100, duration: 1 });
    firebase
      .database()
      .ref('.info/connected')
      .on('value', (data_Etat_Connexion) => {
        if (data_Etat_Connexion.val()) {
          this.etatConnexionUser = true;
        } else {
          this.etatConnexionUser = false;
        }
      });
 

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
    //Verification du User s'il est connecter
    //TODO
    firebase.auth().onAuthStateChanged((data_User: any) => {
      if (data_User) {
        this.user_Connected = true;
      } else {
        this.user_Connected = false;
        this.route.navigate(['/connexion']);
      }
    });
    //Abonnement pour EventEmit de recupere les evennements d'affichage...
    //TODO

    this.subscriptionEvent = this.eventService.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        /**ATTENDRE UNE SECONDE POUR EVITER CETTE ERREUR
         * Angular lance un ExpressionChangedAfterItHasBeenCheckedErrorlorsqu'une
         * valeur d'expression a été modifiée une fois la détection de changement
         */
        setTimeout(() => {
          this.traintementEmitEventAffichageParametre(data_Event);
        }, 1000);
      }
    );
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

  onsignOut() {
    this.user_Connected = false;
    this.serviceAuth.signOutUser();
  }

  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
  }
}
