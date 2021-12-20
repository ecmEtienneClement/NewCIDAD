import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { AppVideo } from 'src/app/Models/modelApi';
import gsap from 'gsap';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModel } from 'src/app/Models/notification';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
@Component({
  selector: 'app-app-video-cmp',
  templateUrl: './app-video-cmp.component.html',
  styleUrls: ['./app-video-cmp.component.css'],
})
export class AppVideoCmpComponent implements OnInit {
  page: number = 1;
  subscription: Subscription = new Subscription();
  //Variable tb
  tbAppVideo: AppVideo[] = [];
  tbAppVideoSearh: AppVideo[] = [];
  tbViewUser: boolean[] = [];
  tbSignalUser: boolean[] = [];
  tbInstanceGsap: any[] = [];
  tbInstanceGsapGeneral: any[] = [];
  //cette variable ns permet l'affichage de tbViewUser[indice] cet dernier ne sera
  //afficher que si verifyViewUser aura fini de remplire le tbViewUser
  tbViewUserCharged: boolean = false;
  tbSignalUserCharged: boolean = false;
  //Variable user connected
  securiteUser: string = '';
  nomUserNotify: string = '';
  user_Id_Connect: string = '';
  chargement: boolean = true;
  chargementSuccess: boolean = false;
  chargementError: boolean = false;
  etatDeployerBtnGeneral: boolean = false;
  aQui: string = '';
  number_Event: number;
  objAppVideo_Event: AppVideo;
  nbrTentative: number = 3;
  constructor(
    private authService: GardGuard,
    private appVideoService: AppVideoService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private eventService: EmitEvent,
    private dialog: MatDialog,
    private notifyService: Notification,
    private errorAlertService: ErrorService
  ) {}
  tb: any;
  res: any;
  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    //recuperation des information du User Connected pour voir si son compte est securisé ou pas
    //TODO
    this.userService
      .getInfoUser(this.user_Id_Connect)
      .then((data_User) => {
        this.nomUserNotify = data_User.nom;
        this.securiteUser = data_User.securite;
      })
      .catch((error) => {
        const message =
          "Une erreure inattendu ! l'or de la recupération de vos données ! Veillez actualiser ou vérifier votre connexion...";
        this.openSnackBar(message, 'ECM');
      });
    //Recuperation du tbAppVideo
    //TODO
    this.subscription.add(
      this.appVideoService.tbAppVideoSubject.subscribe(
        (data_tbAppVideo: AppVideo[]) => {
          this.tbAppVideoSearh = this.tbAppVideo = data_tbAppVideo
            ? data_tbAppVideo
            : [];
          //appelle de verifier pour verifier les url deja vue par le user
          this.verifyViewUserPaginate(this.page);
          //appelle de verifier pour verifier les url deja signaler par le user
          this.verifySignalUser(this.page);
          if (this.tbAppVideoSearh.length > 0) {
            this.chargement = false;
            this.chargementSuccess = true;
            setTimeout(() => {
              this.chargementSuccess = false;
            }, 5000);
          }
        },
        (erreur) => {
          this.chargement = false;
          this.chargementError = true;
        }
      )
    );
    this.appVideoService.emitUpdatetbAppVideo();
    //Emmission event pour affiche parametre video
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.AFFICHE_PARAMETRE_VIDEO,
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
    //Subsciption Pour la verification du code
    //TODO
    this.subscription.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          //Transmission des donnees a la methode traitement ...
          this.traitementSubcriptionCode(data_Event);
        }
      )
    );

    //Mise en place de la subscription pour le tbNotify...cette subcription na que pour but
    //de mettre a jour la vue du composant...
    //TODO
    this.subscription.add(
      this.notifyService.tbNotifySubject.subscribe(
        (data_db_Notify: NotificationModel[]) => {
          //Des que les tbDbNotify arriver je lance la methode de filtre
          if (data_db_Notify) {
            if (data_db_Notify.length > 0) {
              //Recuperation de tbAppVideo
              this.appVideoService.getAllVideo();
            }
          }
        },
        () => {
          alert('Erreur recup Notify Veiller actualisée');
        }
      )
    );
    this.notifyService.emitUpdateTbNotify();
  }
  /**.....................................................................   */
  //Traitement des event parametre affichage
  //TODO
  traintementEmitEventParametreAffichage(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.OPEN_BTN:
        //on verifie si c'est ce component qui a demander l'affichage du parametre
        if (data_Event.data_paylode_String === 'video') {
          this.etatDeployerBtnGeneral = !this.etatDeployerBtnGeneral;
          this.deployerBtnGeneral();
          break;
        } else {
          break;
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
        case 'SignalerVideo':
          this.signaleAppVideo(this.objAppVideo_Event);
          break;
        case 'DeleteVideo':
          this.deleteAppVideo(this.objAppVideo_Event);
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
        this.router.navigate(['/parametre']);
      }
    }
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
        case 'SignalerVideo':
          let confirmationSignale: boolean = confirm(
            'Confirmez-vous le signal de cet URL ?'
          );
          if (confirmationSignale) {
            this.signaleAppVideo(this.objAppVideo_Event);
          }
          break;
        case 'DeleteVideo':
          let confirmationDelete: boolean = confirm(
            'Confirmez-vous la suppression de cet URL  ?'
          );
          if (confirmationDelete) {
            this.deleteAppVideo(this.objAppVideo_Event);
          }
          break;
      }
    } else {
    }
  }
  //Methode Search
  //TODO
  search(query: string): void {
    this.tbAppVideoSearh = query
      ? this.tbAppVideo.filter((video: { cour: string }) =>
          video.cour.toLocaleString().includes(query.toLowerCase())
        )
      : this.tbAppVideo;
  }
  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.getAll();
        break;
      case 1:
        this.getCourTabNav('L1-S1');
        break;
      case 2:
        this.getCourTabNav('L1-S2');
        break;
      case 3:
        this.getCourTabNav('L2-S1');
        break;
      case 4:
        this.getCourTabNav('L2-S2');
        break;
      case 5:
        this.getCourTabNav('L3-S1');
        break;
      case 6:
        this.getCourTabNav('L3-S2');
        break;
    }
  }
  //Tout les cours
  //TODO
  getAll() {
    this.tbAppVideoSearh = this.tbAppVideo;
  }
  // les cours Selectionnés
  //TODO
  getCourTabNav(query: string) {
    this.tbAppVideoSearh = query
      ? this.tbAppVideo.filter((video: { titre: string }) =>
          video.titre.toLocaleString().includes(query.toLowerCase())
        )
      : this.tbAppVideo;
  }
  //Methode pour deployer les btn
  //TODO
  deployerBtnGeneral() {
    let instance = gsap.timeline();
    if (this.etatDeployerBtnGeneral) {
      this.tbInstanceGsapGeneral.push(instance);
      instance.to('.card-cible .blcBtn .btn-nav', {
        opacity: 0,
        duration: 0.5,
        visibility: 'hidden',
      });

      instance.to('.card-cible .blcBtn .btn-delete', {
        ease: 'back',
        visibility: 'visible',
        right: 0,
        duration: 1,
      });
      instance.to('.card-cible .blcBtn .btn-signaler', {
        ease: 'back',
        visibility: 'visible',
        right: 40,
        duration: 1,
      });
      instance.to('.card-cible .blcBtn .btn-copy', {
        ease: 'back',
        visibility: 'visible',
        right: 80,
        duration: 1,
      });
      instance.to('.card-cible .blcBtn .btn-link', {
        ease: 'back',
        visibility: 'visible',
        right: 120,
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
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-signaler`, {
      ease: 'back',
      visibility: 'visible',
      right: 40,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-copy`, {
      ease: 'back',
      visibility: 'visible',
      right: 80,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blcBtn .btn-link`, {
      ease: 'back',
      visibility: 'visible',
      right: 120,
      duration: 1,
    });
  }
  //Methode pour fermer le blc les btn
  //TODO
  closeBlcBtn() {
    this.tbInstanceGsap[0].reversed(true);
    this.tbInstanceGsap.splice(0, 1);
  }
  //Methode pour ajouter le user ds tbViewUser
  //TODO
  addViewUser(id_video: number) {
    let index: number;
    this.tbAppVideo.forEach((element) => {
      if (element._id == id_video) {
        index = this.tbAppVideo.indexOf(element);
        if (
          //verifi si le user n'a pas deja vue la videp
          !this.tbAppVideo[index].viewUser.includes(this.user_Id_Connect)
        ) {
          this.tbAppVideo[index].viewUser.unshift(this.user_Id_Connect);
          let appVideo: AppVideo = this.tbAppVideo[index];

          this.appVideoService
            .updateVideo(
              appVideo.userId,
              appVideo.cour,
              appVideo.titre,
              appVideo.url,
              appVideo.signaler,
              appVideo.viewUser,
              appVideo.date,
              id_video
            )
            .then(() => {
              console.log('success view User appVideo ECM ... ');
            });
        }
      }
    });
  }
  //Methode pour copier le lien du video
  //TODO
  copyUrlAppVideo(indice: number, urlAppVidep: string) {
    navigator.clipboard.writeText(urlAppVidep);
    let instance = gsap.timeline();
    instance.to(
      `.card-cible:nth-child(${
        indice + 1
      }) .container .row .container-parent-txtCopy .textecommentaire .titre`,
      {
        opacity: 0,
        duration: 0.5,
      }
    );
    instance.to(
      `.card-cible:nth-child(${
        indice + 1
      }) .container .row .container-parent-txtCopy .textecommentaire .textecopy`,
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
  //Methode pour signaler le lien du video
  //TODO
  onVerifySignalappVideo(objAppVideo: AppVideo) {
    this.aQui = 'SignalerVideo';
    this.objAppVideo_Event = objAppVideo;
    this.onVerifyUser();
  }
  signaleAppVideo(objAppVideo: AppVideo) {
    let index: number;
    let trouver: boolean = false;
    this.tbAppVideo.forEach((element) => {
      if (element._id == objAppVideo._id) {
        index = this.tbAppVideo.indexOf(element);

        if (this.tbAppVideo[index].signaler.length < 6) {
          //verifi si le user n'a pas deja signaler
          trouver = this.tbAppVideo[index].signaler.includes(
            this.user_Id_Connect
          );

          if (!trouver) {
            this.tbAppVideo[index].signaler.unshift(this.user_Id_Connect);
            let appVideo: AppVideo = this.tbAppVideo[index];
            // this.appVideoService.updateVideo()
            this.appVideoService
              .updateVideo(
                appVideo.userId,
                appVideo.cour,
                appVideo.titre,
                appVideo.url,
                appVideo.signaler,
                appVideo.viewUser,
                appVideo.date,
                objAppVideo._id
              )
              .then((good: boolean) => {
                if (good) {
                  const message =
                    'Votre signal a été bien pris en compte.  Merçi !';
                  //Affichage de l'alerte
                  this.openSnackBar(message, 'ECM');
                }
              });
          }
        } else {
          const message =
            'Vous venez de combler le nombre de signale ! le lien sera supprimé dans 2s';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.deleteAppVideo(objAppVideo);
          }, 3000);
        }
      }
    });
    if (trouver) {
      const message = 'Humm !!! Vous avez déja signaler ce lien ';
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
      setTimeout(() => {
        alert(
          "Attention ! Nous avons constaté que vous venez d'effectué une action suspecte ! Vous serrez classé dans la zone d'observation "
        );
      }, 3000);
    }
  }
  //Methode pour supprimer lien du video
  //TODO
  onVerifydeleteappVideo(objAppVideo: AppVideo) {
    this.aQui = 'DeleteVideo';
    this.objAppVideo_Event = objAppVideo;
    this.onVerifyUser();
  }
  deleteAppVideo(objAppVideo: AppVideo) {
    this.appVideoService.deleteVideo(objAppVideo).then((good) => {
      if (good) {
        const message = 'Le lien a été bien supprimer !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      }
    });
  }
  //Methode pour Verifier si le user a deja visioner le url
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
      this.tbAppVideo.forEach((element) => {
        const indexElement: number = this.tbAppVideo.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.viewUser.includes(this.user_Id_Connect)) {
            //on utilise unshift a la place de push pour eviter apres a fair le reverse du tbViewUser
            //afin que les indices tbViewUser soient compatible avc ceux du tbAppVideo
            //false si le user a lu cette video
            this.tbViewUser.unshift(false);
          } else {
            this.tbViewUser.unshift(true);
          }
        }
      });
      this.tbViewUserCharged = true;
    } else {
      this.errorAlertService.notifyAlertErrorDefault();
    }
  }
  //Methode pour Verifier si le user a deja signaler ce url
  //TODO

  verifySignalUser(pageIndex: number = 1) {
    /*Bien ! avec la pagination les index vont changer exp si a la page 2..et autre
     *les bug vont changer d'index pour resoudre ce probleme on redefini le tbView a
     *l'aide de l'index
     */
    pageIndex = 10 * (pageIndex - 1);
    this.tbSignalUserCharged = false;
    this.tbSignalUser = [];
    if (this.user_Id_Connect != '') {
      this.tbAppVideo.forEach((element) => {
        const indexElement: number = this.tbAppVideo.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.signaler.includes(this.user_Id_Connect)) {
            this.tbSignalUser.unshift(true);
          } else {
            //true si le user na op encore signaler cette video
            this.tbSignalUser.unshift(false);
          }
        }
      });
      this.tbSignalUserCharged = true;
    } else {
      this.errorAlertService.notifyAlertErrorDefault();
    }
  }
  //Methode pour emmettre le changemant de la page afin de recalculer les valeurs du tbViewUser
  //TODO
  pageChanged(event: any) {
    this.page = event;
    this.verifyViewUserPaginate(this.page);
    this.verifySignalUser(this.page);
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    //Emmission event pour fermer les parametres ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.CLOSE_BTN,
    });
  }
}
