import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { AppPlugin } from 'src/app/Models/modelApi';

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
  //Variables du user
  nomUser: string = '';
  prenomUser: string = '';
  promoUser: string = '';
  fantome: string = '';

  //Variable tb
  tbAppPlugin: AppPlugin[] = [];
  tbAppPluginSearh: AppPlugin[] = [];

  userIdPluging: string = '';
  nbrCommentaire: number = 0;

  totalPage: number = 0;
  user_Id_Connect?: string = '';
  chargement: boolean = true;

  subscriptionEvent: Subscription = new Subscription();
  subscriptionTbPlugin: Subscription = new Subscription();
  constructor(
    private authService: GardGuard,
    private appPluginService: AppPlugingService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private eventService: EmitEvent
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    //Recuperation du TbAppPlugin
    //TODO
    this.subscriptionTbPlugin =
      this.appPluginService.tbAppPluginSubject.subscribe(
        (data_tbAppPlugin) => {
          if (data_tbAppPlugin) {
            this.tbAppPluginSearh = this.tbAppPlugin = data_tbAppPlugin;
            this.chargement = false;
            this.totalPage = this.tbAppPlugin.length;
          }
        },
        (error) => {}
      );
    this.appPluginService.emitUpdateTbAppPlugin();
    //Abonnement pour EventEmit de recupere les evennements parametre affichage  ...
    //TODO
    this.subscriptionEvent = this.eventService.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        this.traintementEmitEventParametreAffichage(data_Event);
      }
    );
    //Emmission event pour affiche parametre plugin
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.AFFICHE_PARAMETRE_PLUGIN,
    });
  }
  //Traitement des event parametre affichage
  //TODO
  traintementEmitEventParametreAffichage(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.OPEN_BTN_CARD_PLUGIN:
        this.deployerbtnUser = !this.deployerbtnUser;
        this.deployerbtnView = !this.deployerbtnView;
        this.deployerbtnnbr = !this.deployerbtnnbr;
        this.deployerbtnupdate = !this.deployerbtnupdate;
        this.deployerbtndelete = !this.deployerbtndelete;
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
        this.getMesPlugins(this.user_Id_Connect);
        break;
      case 2:
        this.getPluginUpdate();
    }
  }

  //Methode pour emettre tt les Plugins
  //TODO
  getAll() {
    this.tbAppPluginSearh = this.tbAppPlugin;
  }
  //Methode pour emettre les plugins du user
  //TODO
  getMesPlugins(userId?: string) {
    let tbAppPluginMethode: AppPlugin[] = [];
    this.tbAppPlugin.forEach((item) => {
      if (item.userId == userId) {
        tbAppPluginMethode.push(item);
      }
    });
    this.tbAppPluginSearh = tbAppPluginMethode;
    alert(tbAppPluginMethode.length);
  }
  //Methode pour emettre les plugins modifié
  //TODO
  getPluginUpdate() {
    alert('modifier');
  }

  //Methode Search
  //TODO
  search(query: string): void {
    this.tbAppPluginSearh = query
      ? this.tbAppPlugin.filter((bug: { language: string }) =>
          bug.language.toLocaleString().includes(query.toLowerCase())
        )
      : this.tbAppPlugin;
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
  viewPlugin(idPlugin?: number) {
    this.router.navigate(['detailsPluging/' + idPlugin]);
  }
  //Methode nbr pour afficher le nbr du appPlugin
  //TODO
  nbrPlugin(id?: number) {
    let tbOneAppPlugin = this.tbAppPlugin.filter((item) => {
      item._id === id;
    });
    this.nbrCommentaire =
      tbOneAppPlugin.length == 1 ? tbOneAppPlugin[0].tbCommentaire.length : 0;
  }
  //Methode pour naviger ver le cmp de updateAppPlugin
  //TODO
  updatePlugin(id?: number) {
    this.router.navigate(['updatePluging/' + id]);
  }
  //Methode pour supprimer le Plugin
  //TODO
  deletePlugin(id?: number|string) {
    this.appPluginService
      .deletePlugin(id)
      .then((good) => {
        if (good) {
          const message = 'Le Plugin a été bien supprimer !';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
        }
      })
      .catch((error) => {
        const message = 'Veillez verifier votre connexion ou actualisé !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      });
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnDestroy(): void {
    this.subscriptionEvent.unsubscribe();
    this.subscriptionTbPlugin.unsubscribe();
    //Emmission event pour fermer les parametres ecm
    //TODO
    this.eventService.emit_Event_Update_({
      type: EventType.FERMER_PARAMETRE_PLUGIN,
    });
  }
  //...................................................................
}
