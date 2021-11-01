import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertDialogueCodeComponent } from 'src/app/MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { CommentaireModel } from 'src/app/Models/commentaire';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { AppPlugin } from 'src/app/Models/modelApi';
import { NotificationModel } from 'src/app/Models/notification';

@Component({
  selector: 'app-details-plugins',
  templateUrl: './details-plugins.component.html',
  styleUrls: ['./details-plugins.component.css'],
})
export class DetailsPluginsComponent implements OnInit {
  user_Id_Connect: string;
  //stocker des donnees dans le champs saisi
  commentaire: string = '';
  nomUserPlugin: string = '';
  prenomUserPlugin: string = '';
  promoUserPlugin: string = '';

  idPlugin?: number;
  pluginCmp: AppPlugin = {
    _id: 0,
    language: '',
    documentation: '',
    code: '',
    tbCommentaire: [new CommentaireModel('', '', '', '', '', 0)],
    userId: '',
    date: 0,
    update: 0,
    tbViewUser: [],
    tbSignalCommentaire: [],
    tbViewCommentaire: [],
  };
  //info du user connecter
  nomUser: string = '';
  prenomUser: string = '';
  promoUser: string = '';
  fantome: string = '';
  securiteUser: string = '';
  subscription: Subscription = new Subscription();

  aQui: string = '';
  Date_Commentaire_number_Event: number;
  User_Id_Commentaire_string_Event: string = '';

  nbrTentative: number = 3;
  constructor(
    private extra: ActivatedRoute,
    private appPluginService: AppPlugingService,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private eventService: EmitEvent,
    private dialog: MatDialog,
    private authService: GardGuard,
    private router: Router,
    private notify: Notification,
    private errorAlert: ErrorService,
    private notifyService: Notification
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    //Recuperation des informations du user pour le commentaire
    //TODO
    this.userService.VerifyLocaleStorage().then((data_ObjUser) => {
      this.nomUser = data_ObjUser.nom;
      this.prenomUser = data_ObjUser.prenom;
      this.promoUser = data_ObjUser.promotion;
      this.fantome = data_ObjUser.fantome;
      this.securiteUser = data_ObjUser.securite;
    });

    //...Recuperation de l'indice via l'url
    //TODO
    this.idPlugin = this.extra.snapshot.params['idPlugin'];
    //Mise en place de la subscription pour le tbNotify afin de recharger les commentaires
    //si le user est ligne dans la page...
    //TODO
    this.subscription.add(
      this.notifyService.tbNotifySubject.subscribe(
        (data_db_Notify: NotificationModel[]) => {
          if (data_db_Notify.length > 0) {
            //Appelle de getDetailsPlugin
            //TODO
            this.appPluginService
              .getDetailsPlugin(this.idPlugin)
              .then((data_App_Plugin: AppPlugin) => {
                if (data_App_Plugin) {
                  this.pluginCmp = data_App_Plugin;
                  //on marque imediatement vu au commentaires si le user est en ligne
                  this.appPluginService.addViewCommentairePlugin(
                    this.pluginCmp,
                    this.user_Id_Connect
                  );
                }
              })
              .catch(() => {
                this.errorAlert.notifyAlertErrorDefault(
                  "Une action d'injection de valeur s'est produite !"
                );
              });
          }
        },
        () => {
          this.errorAlert.notifyAlertErrorDefault();
        }
      )
    );

    //Appelle de getDetailsPlugin
    //TODO
    this.appPluginService
      .getDetailsPlugin(this.idPlugin)
      .then((data_App_Plugin: AppPlugin) => {
        if (data_App_Plugin) {
          this.pluginCmp = data_App_Plugin;

          if (this.pluginCmp._id != '') {
            this.appPluginService.addViewPlugin(
              this.pluginCmp,
              this.user_Id_Connect
            );
            this.appPluginService.addViewCommentairePlugin(
              this.pluginCmp,
              this.user_Id_Connect
            );
          }

          //Recuperation des info du user qui a poster ce bug ...via son ID
          if (data_App_Plugin) {
            this.userService
              .getInfoUser(this.pluginCmp.userId)
              .then((data_User) => {
                this.nomUserPlugin = data_User.nom;
                this.prenomUserPlugin = data_User.prenom;
                this.promoUserPlugin = data_User.promotion;
              })
              .catch((error) => {
                alert(
                  'Une erreur est survenue ! Veiller vérifier votre connexion ou actualisé ...!'
                );
              });
          }
        }
      })
      .catch((error) => {
        alert("Cet plugin n'existe pas !");
        this.router.navigate(['/appPlugin']);
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

  /**.................................................. */

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
  //Recupration des donnees a envoye..
  //TODO
  onSubmitForm() {
    let userCommentaire: CommentaireModel;
    if (this.fantome == 'false') {
      userCommentaire = new CommentaireModel(
        this.commentaire,
        this.user_Id_Connect,
        this.nomUser,
        this.prenomUser,
        this.promoUser,
        Date.now()
      );
    } else {
      userCommentaire = new CommentaireModel(
        this.commentaire,
        this.user_Id_Connect
      );
    }
    //Enregistrement du commentaire dans tb Plugin
    this.pluginCmp.tbCommentaire.push(userCommentaire);
    //Enregistrement ou abonement du user a qui apartient lle plugins
    if (!this.pluginCmp.tbSignalCommentaire.includes(this.pluginCmp.userId)) {
      this.pluginCmp.tbSignalCommentaire.push(this.pluginCmp.userId);
    }
    //Enregistrement ou abonement du user qui a commmenté au alert notification
    if (!this.pluginCmp.tbSignalCommentaire.includes(this.user_Id_Connect)) {
      this.pluginCmp.tbSignalCommentaire.push(this.user_Id_Connect);
    }
    //Netoyage du tb  View pour que les autres recoivent de nouveau le new commentaire
    this.pluginCmp.tbViewCommentaire = [this.user_Id_Connect];

    //Enregistrement du commentaire dans la bd avec le update
    this.appPluginService
      .updatePlugin(
        this.pluginCmp.language,
        this.pluginCmp.documentation,
        this.pluginCmp.code,
        this.pluginCmp.tbCommentaire,
        this.pluginCmp.userId,
        this.pluginCmp.date,
        this.pluginCmp.update,
        this.pluginCmp.tbViewUser,
        this.pluginCmp.tbSignalCommentaire,
        this.pluginCmp.tbViewCommentaire,
        this.idPlugin
      )
      .then((good: boolean) => {
        if (good) {
          const debut_Documentation = this.pluginCmp.documentation.substr(
            0,
            10
          );
          this.notify.notifyCommentairePlugins(
            debut_Documentation,
            this.pluginCmp,
            this.user_Id_Connect
          );
          const message = 'Votre commentaire a été bien ajouté ...';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
        }
      })
      .catch((noGood) => {
        if (!noGood) {
          this.errorAlert.notifyAlertErrorDefault();
        }
      });

    this.commentaire = '';
  }
  //...Suppression de la reponse Bug ...
  //TODO
  onResetForm() {
    this.commentaire = '';
  }
  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser(User_Id_Commentaire: string, DateCommentaire: number) {
    if (this.securiteUser == 'true') {
      //ecrit sur la variable memoire
      this.aQui = 'DeleteCommentaire';
      this.User_Id_Commentaire_string_Event = User_Id_Commentaire;
      this.Date_Commentaire_number_Event = DateCommentaire;
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUser == 'false') {
      let confirmationDelete: boolean = confirm(
        'Confirmez-vous la suppression'
      );
      if (confirmationDelete) {
        this.deleteCommentaire(User_Id_Commentaire, DateCommentaire);
      }
    }
  }
  deleteCommentaire(User_Id_Commentaire: string, DateCommentaire: number) {
    let trouver: boolean = false;
    //Enregistrement du commentaire dans tb Plugin
    this.pluginCmp.tbCommentaire.forEach((element) => {
      if (
        element.dateCommentaire == DateCommentaire &&
        element.Id_User == User_Id_Commentaire
      ) {
        const index: number = this.pluginCmp.tbCommentaire.indexOf(element);
        this.pluginCmp.tbCommentaire.splice(index, 1);
        trouver = true;
      }
    });
    if (!trouver) {
      const message =
        "Une erreur inattendu ! l'or de la suppréssion du commentaire ! Veillez le signaler à ECM...";
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
    }
    //Enregistrement du commentaire dans la bd avec le update
    this.appPluginService
      .updatePlugin(
        this.pluginCmp.language,
        this.pluginCmp.documentation,
        this.pluginCmp.code,
        this.pluginCmp.tbCommentaire,
        this.pluginCmp.userId,
        this.pluginCmp.date,
        this.pluginCmp.update,
        this.pluginCmp.tbViewUser,
        this.pluginCmp.tbSignalCommentaire,
        this.pluginCmp.tbViewCommentaire,
        this.idPlugin
      )
      .then((good: boolean) => {
        if (good) {
          const message = 'Votre commentaire a été bien supprimée ...';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
        }
      })
      .catch((noGood) => {
        if (!noGood) {
          const message = 'Veillez vérifier votre connexion ou actualisé !';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
        }
      });
  }
  //Traitement de la reponse du event code de verification ...
  //TODO
  verifyReponseEvent(reponse: any) {
    if (reponse == 1) {
      this.dialog.closeAll();
      //switcher aQui me permet de retrouver l'event et de pouvoir appeller la fonction concerné
      switch (this.aQui) {
        case 'DeleteCommentaire':
          this.deleteCommentaire(
            this.User_Id_Commentaire_string_Event,
            this.Date_Commentaire_number_Event
          );
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
  }
}
