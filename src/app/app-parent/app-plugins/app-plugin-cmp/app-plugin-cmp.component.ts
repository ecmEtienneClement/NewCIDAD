import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { AppPlugin } from 'src/app/Models/modelApi';
import gsap from 'gsap';
@Component({
  selector: 'app-app-plugin-cmp',
  templateUrl: './app-plugin-cmp.component.html',
  styleUrls: ['./app-plugin-cmp.component.css'],
})
export class AppPluginCmpComponent implements OnInit, OnDestroy {
  //Variables pour le deployement
  deployerbtnUser: boolean = false;
  deployerbtnView: boolean = false;
  deployerbtnnbr: boolean = false;
  deployerbtnupdate: boolean = false;
  deployerbtndelete: boolean = false;
  animationUser: boolean = false;
  //Variables du user connected
  securiteUser: string | null = '';
  nomUserNotify: string | null = '';
  //Variable du user plugin
  nomUser: string = '';
  prenomUser: string = '';
  promoUser: string = '';
  fantome: string = '';
  ppUserPlugin: string = '';
  ppUserNotify: string = '';
  //Variable tb VIEW
  tbViewUser: boolean[] = [];
  tbSignalCommentaireUser: boolean[] = [];
  tbViewCommentaireUser: boolean[] = [];
  tbViewUserCharged: boolean = false;
  tbSignalCommentaireUserCharged: boolean = false;
  tbViewCommentaireUserCharged: boolean = false;
  i: number = 0;
  //Variable tb
  tbAppPlugin: AppPlugin[] = [];
  tbAppPluginSearh: AppPlugin[] = [];
  tbInstanceGsap: any[] = [];

  userIdPluging: string = '';
  nbrCommentaire: number = 0;

  totalPage: number = 0;
  user_Id_Connect: string = '';
  chargement: boolean = true;
  aQui: string = '';
  obj_Event: AppPlugin;
  subscription: Subscription = new Subscription();
  nbrTentative: number = 3;
  page: number = 1;
  constructor(
    private authService: GardGuard,
    private appPluginService: AppPlugingService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private eventService: EmitEvent,
    private dialog: MatDialog,
    private errorAlertService: ErrorService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    //recuperation des information du User Connected pour voir si son compte est securisé ou pas
    //TODO
    this.userService
      .VerifyLocaleStorage()
      .then((data_ObjUser) => {
        this.nomUserNotify = data_ObjUser.nom;
        this.securiteUser = data_ObjUser.securite;
        this.ppUserNotify = data_ObjUser.ppUser;
      })
      .catch(() => {
        this.errorAlertService.notifyAlertErrorDefault();
      });
    //Recuperation du TbAppPlugin
    //TODO
    this.subscription.add(
      this.appPluginService.tbAppPluginSubject.subscribe(
        (data_tbAppPlugin) => {
          if (data_tbAppPlugin) {
            this.tbAppPluginSearh = this.tbAppPlugin =
              data_tbAppPlugin.reverse();
            this.chargement = false;
            this.totalPage = this.tbAppPlugin.length;
            this.verifyViewUserPaginate(this.page);
            this.verifySignalUserPaginate(this.page);
            this.verifyViewCommentaireUserPaginate(this.page);
          }
        },
        (error) => {}
      )
    );
    this.appPluginService.emitUpdateTbAppPlugin();
    //Abonnement pour EventEmit de recupere les evennements parametre affichage  ...
    //TODO
    this.subscription.add(
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          this.traintementEmitEventParametreAffichage(data_Event);
        }
      )
    );
    //Emmission event pour affiche parametre plugin
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.AFFICHE_PARAMETRE_PLUGIN,
    });
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
  }
  /**........................................................................... */

  //Methode pour Verifier si les alerts du user
  //TODO
  verifyViewUserPaginate(pageIndex: number = 1) {
    pageIndex = 4 * (pageIndex - 1);
    this.tbViewUserCharged = false;
    this.tbViewUser = [];
    if (this.user_Id_Connect != '') {
      this.tbAppPluginSearh.forEach((element) => {
        const indexElement: number = this.tbAppPluginSearh.indexOf(element);
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
      this.errorAlertService.notifyAlertErrorDefault();
    }
  }
  verifySignalUserPaginate(pageIndex: number = 1) {
    pageIndex = 4 * (pageIndex - 1);
    this.tbSignalCommentaireUserCharged = false;
    this.tbSignalCommentaireUser = [];
    if (this.user_Id_Connect != '') {
      this.tbAppPluginSearh.forEach((element) => {
        const indexElement: number = this.tbAppPluginSearh.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.tbSignalCommentaire.includes(this.user_Id_Connect)) {
            this.tbSignalCommentaireUser.push(true);
          } else {
            this.tbSignalCommentaireUser.push(false);
          }
        }
      });
      this.tbSignalCommentaireUserCharged = true;
    } else {
      this.errorAlertService.notifyAlertErrorDefault();
    }
  }
  verifyViewCommentaireUserPaginate(pageIndex: number = 1) {
    pageIndex = 4 * (pageIndex - 1);
    this.tbViewCommentaireUserCharged = false;
    this.tbViewCommentaireUser = [];
    if (this.user_Id_Connect != '') {
      this.tbAppPluginSearh.forEach((element) => {
        const indexElement: number = this.tbAppPluginSearh.indexOf(element);
        if (indexElement >= pageIndex) {
          if (element.tbViewCommentaire.includes(this.user_Id_Connect)) {
            this.tbViewCommentaireUser.push(false);
          } else {
            this.tbViewCommentaireUser.push(true);
          }
        }
      });
      this.tbViewCommentaireUserCharged = true;
    } else {
      this.errorAlertService.notifyAlertErrorDefault();
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
  //Traitement des event parametre affichage
  //TODO
  traintementEmitEventParametreAffichage(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.OPEN_BTN:
        //on verifie si c'est ce component qui a demander l'affichage du parametre
        if (data_Event.data_paylode_String === 'plugin') {
          this.deployerbtnUser = !this.deployerbtnUser;
          this.deployerbtnView = !this.deployerbtnView;
          this.deployerbtnnbr = !this.deployerbtnnbr;
          this.deployerbtnupdate = !this.deployerbtnupdate;
          this.deployerbtndelete = !this.deployerbtndelete;
          break;
        } else {
          break;
        }
    }
  }
  //Verification de l'evenement afin de le traite avec la bonne methode ..
  //TODO
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.getAll();
        this.verifyViewUserPaginate(this.page);
        this.verifySignalUserPaginate(this.page);
        this.verifyViewCommentaireUserPaginate(this.page);
        break;
      case 1:
        this.getMesPlugins();
        this.verifyViewUserPaginate(this.page);
        this.verifySignalUserPaginate(this.page);
        this.verifyViewCommentaireUserPaginate(this.page);
        break;
      case 2:
        this.getPluginUpdate();
        this.verifyViewUserPaginate(this.page);
        this.verifySignalUserPaginate(this.page);
        this.verifyViewCommentaireUserPaginate(this.page);
    }
  }

  //Methode pour emettre tt les Plugins
  //TODO
  getAll() {
    this.tbAppPluginSearh = this.tbAppPlugin;
  }
  //Methode pour emettre les plugins du user
  //TODO
  getMesPlugins() {
    this.tbAppPluginSearh =
      this.tbAppPlugin.filter((post) => post.userId == this.user_Id_Connect)
        .length !== 0
        ? this.tbAppPlugin.filter((post) => post.userId == this.user_Id_Connect)
        : [];
  }
  //Methode pour emettre les plugins modifié
  //TODO
  getPluginUpdate() {
    this.tbAppPluginSearh =
      this.tbAppPlugin.filter((post) => post.update == 1).length !== 0
        ? this.tbAppPlugin.filter((post) => post.update == 1)
        : [];
  }

  //Methode Search
  //TODO
  search(query: string): void {
    this.tbAppPluginSearh = query
      ? this.tbAppPlugin.filter((bug: { language: string }) =>
          bug.language.toLocaleString().includes(query.toLowerCase())
        )
      : this.tbAppPlugin;
    this.verifyViewUserPaginate(this.page);
    this.verifySignalUserPaginate(this.page);
    this.verifyViewCommentaireUserPaginate(this.page);
  }
  //......Voir les information du User
  //TODO
  onViewInfoUser(user_Id: any = '', indice: number) {
    this.animInfoUser(indice);
    this.userService
      .getInfoUser(user_Id)
      .then((data_User) => {
        this.nomUser = data_User.nom;
        this.prenomUser = data_User.prenom;
        this.promoUser = data_User.promotion;
        this.fantome = data_User.fantome;
        this.ppUserPlugin = data_User.ppUser;
      })
      .catch(() => {
        const message = 'Veillez verifier votre connexion ou actualisé !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      });
    //Netoyage des donnes avant d'afficher un autre appelle de viewInfoUser
    this.nomUser = '';
    this.prenomUser = '';
    this.promoUser = '';
    this.fantome = '';
  }
  //Methode pour rediriger le User pour voir les details
  //TODO
  viewPlugin(objPlugin: AppPlugin) {
    this.router.navigate(['/details/Pluging/' + objPlugin._id]);
  }
  //Methode nbr pour afficher le nbr du appPlugin
  //TODO
  nbrPlugin(id?: number) {
    let tbOneAppPlugin = this.tbAppPlugin.filter((item) => item._id === id);
    this.nbrCommentaire =
      tbOneAppPlugin.length == 1 ? tbOneAppPlugin[0].tbCommentaire.length : 0;
  }
  //Methode pour naviger ver le cmp de updateAppPlugin
  //TODO
  updatePlugin(objPlugin: AppPlugin) {
    this.aQui = 'UpdatePlugin';
    this.onVerifyUser(objPlugin);
  }
  //Methode pour supprimer le Plugin
  //TODO
  deletePlugin(objPlugin: AppPlugin) {
    this.aQui = 'DeletePlugin';
    this.onVerifyUser(objPlugin);
  }

  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser(objPlugin: AppPlugin): boolean {
    if (this.securiteUser == 'true') {
      //ecrit sur la variable memoire
      this.obj_Event = objPlugin;
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUser == 'false') {
      //Passe directement a la suppression si le user n'a pas securiser son compte
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'UpdatePlugin':
          this.router.navigate([
            'update',
            objPlugin.userId,
            'Pluging',
            objPlugin._id,
          ]);
          break;
        case 'DeletePlugin':
          let confirmationDelete: boolean = confirm(
            'Confirmez-vous la suppression'
          );
          if (confirmationDelete) {
            if (this.user_Id_Connect !== objPlugin.userId) {
              this.errorAlertService.notifyActionNonPermise('cet plugin');
              return false;
            }
            this.appPluginService
              .deletePlugin(objPlugin)
              .then((good) => {
                if (good) {
                  const message = 'Le Plugin a été bien supprimer !';
                  //Affichage de l'alerte
                  this.openSnackBar(message, 'ECM');
                }
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault();
              });
            break;
          }
      }
    }
    return true;
  }
  //Traitement de la reponse du event code de verification ...
  //TODO
  verifyReponseEvent(reponse: any): boolean {
    if (reponse == 1) {
      this.dialog.closeAll();
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'UpdatePlugin':
          this.router.navigate([
            'update',
            this.obj_Event.userId,
            'Pluging',
            this.obj_Event._id,
          ]);
          break;
        case 'DeletePlugin':
          if (this.user_Id_Connect !== this.obj_Event.userId) {
            this.errorAlertService.notifyActionNonPermise('cet plugin');
            return false;
          }
          this.appPluginService
            .deletePlugin(this.obj_Event)
            .then((good) => {
              if (good) {
                const message = 'Le Plugin a été bien supprimer !';
                //Affichage de l'alerte
                this.openSnackBar(message, 'ECM');
              }
            })
            .catch(() => {
              this.errorAlertService.notifyAlertErrorDefault();
            });
          break;
      }
    } else {
      if (this.nbrTentative > 1) {
        --this.nbrTentative;
        const message = `Votre code est incorrect !tentative (s) restante (s) ${this.nbrTentative}`;
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
    return true;
  }
  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //Methode pour emmettre le changemant de la page afin de recalculer les valeurs du tbViewUser
  //TODO
  pageChanged(event: any) {
    this.page = event;
    this.verifyViewUserPaginate(this.page);
    this.verifySignalUserPaginate(this.page);
    this.verifyViewCommentaireUserPaginate(this.page);
  }
  //Methode pour la demande de code
  //TODO
  openDialog() {
    this.dialog.open(AlertDialogueCodeComponent);
  }
  //Animation info user
  //TODO
  animInfoUser(indice: number) {
    if (this.tbInstanceGsap.length != 0) {
      this.tbInstanceGsap[0].reversed(true);
      this.tbInstanceGsap.splice(0, 1);
    }
    this.deployerbtnUser = true;
    let instance = gsap.timeline();
    this.tbInstanceGsap.push(instance);
    //
    instance.to(`.card-cible:nth-child(${indice + 1}) mat-card-subtitle`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) mat-card-title`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) mat-card-content`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .btnliste`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .fa-user-injured`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .liUser`, {
      ease: 'bounce',
      top: 285,
      duration: 1,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .liUser`, {
      duration: 2,
      scale: 28,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .liUser`, {
      visibility: 'hidden',
      duration: 2,
    });
    instance.to(`.card-cible:nth-child(${indice + 1}) .blocInfoUser`, {
      ease: 'back',
      zIndex: 10,
      duration: 1,
      left: 0,
    });
  }
  //Methode pour fermer les info user
  //TODO
  resetCarUser() {
    this.tbInstanceGsap[0].reversed(true);
    this.tbInstanceGsap.splice(0, 1);
    setTimeout(() => {
      this.deployerbtnUser = false;
    }, 7000);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    //Emmission event pour fermer les parametres ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.CLOSE_BTN,
    });
  }
  //...................................................................
}
