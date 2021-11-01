import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { NotifyModel } from 'src/app/Models/eventAction';
import { NotificationModel } from 'src/app/Models/notification';

@Component({
  selector: 'app-notify-app-plugin',
  templateUrl: './notify-app-plugin.component.html',
  styleUrls: ['./notify-app-plugin.component.css'],
})
export class NotifyAppPluginComponent implements OnInit {
  //Variable pour les notifications...
  tbNotify: NotificationModel[] = [];
  user_Id_Connect: string;
  //Variable de subcription
  subscriptionDbNotify: Subscription = new Subscription();

  nbrNewPlugins: number = 0;
  tbTitreCommentairePlugins: NotifyModel[] = [];
  nbrtbCommentairePlugins: number = 0;
  nbrTotalNotify: number = 0;
  @Input() nomUserNotify: string|null;

  constructor(
    private notifyService: Notification,
    private authService: GardGuard,
    private appPluginService: AppPlugingService
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;

    //Mise en place de la subscription pour le tbNotify...
    //TODO
    this.subscriptionDbNotify = this.notifyService.tbNotifySubject.subscribe(
      (data_db_Notify: NotificationModel[]) => {
        //Des que les tbDbNotify arriver je lance la methode de filtre
        if (data_db_Notify.length > 0) {
          //Recuperation de tbAppPlugin
          this.appPluginService.getAllPlugin();
          this.tbNotify = data_db_Notify;

          //Filtrage du tbNotify pour acceder a la collection du user..
          //Premierement on recupere la collection du user dans la tbNotify aveson ID
          //TODO
          let tbFilterByIdNotify: NotificationModel[];
          tbFilterByIdNotify = this.tbNotify.filter(
            (reponse) => reponse.id_User == this.user_Id_Connect
          );

          //Recuperation des new Plugings
          //todo
          this.nbrNewPlugins = tbFilterByIdNotify[0].length_Tb_AppPlugins;

          //Recuperation du tbTitreCommentairePlugins
          //todo
          if (tbFilterByIdNotify[0].tbCommentairePlugins[0].nbr != 0) {
            this.tbTitreCommentairePlugins =
              tbFilterByIdNotify[0].tbCommentairePlugins;
            //Comptage de nbr reponse total tjr remettre nbrtbCommentairePlugins à 0
            this.nbrtbCommentairePlugins = 0;
            this.tbTitreCommentairePlugins.forEach((item) => {
              this.nbrtbCommentairePlugins += item.nbr;
            });
          }

          //Recuperation des notifications total
          //todo
          this.nbrTotalNotify = tbFilterByIdNotify[0].nbrTotalNotifyPlugin;
        }
      },
      (error) => {
        alert('Erreur recup Notify Veiller actualisée');
      }
    );
    this.notifyService.emitUpdateTbNotify();
  }

  ngOnDestroy(): void {
    this.subscriptionDbNotify.unsubscribe();
    this.notifyService.onResetCollectionNotifyUserPlugin();
  }
}
