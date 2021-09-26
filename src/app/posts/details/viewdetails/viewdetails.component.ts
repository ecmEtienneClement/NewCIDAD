import { Component, Input } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventType } from 'src/app/Models/eventAction';
import { ReponseBugModel } from 'src/app/Models/reponseBug';

@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.component.html',
  styleUrls: ['./viewdetails.component.css'],
})
export class ViewdetailsComponent {
  @Input() prenom: string;
  @Input() nom: string;
  @Input() promo: string;
  @Input() fantome: boolean;
  @Input() tbReponseBug: ReponseBugModel[];
  @Input() totalPage: number;
  @Input() user_Id_Connect: string;
  @Input() user_Id_Bug: string;

  page: number = 1;
  commentaire: string = '';

  constructor(private eventService: EmitEvent) {}

  //Suppression des donnees a envoye..
  //TODO
  onResetForm() {
    this.commentaire = '';
  }

  /*

   MISE EN PLACE DES METHODES POUR L'EMMISSION DES DIFFERRENTS EVENEMENTS ...

  */
  // ..................................ALERT.............................................
  //Pour PageNavigation Voir commentaire ECM pour comprendre sont ajout au Event Emit
  //Methode pour modifer le isGood du commentaire ..

  //Methode Pour Voir Les Informations du User
  //TODO
  onViewUser(user_Id: any) {
    this.eventService.emit_Event_Update_({
      type: EventType.VIEW_INFO_USER,
      data_paylode_Number: 0,
      data_paylode_String: user_Id,
    });
  }
  //TODO
  onCheck(id_Reponse: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.CHEKED_REPONSE_BUG,
      data_paylode_String: id_Reponse,
    });
  }
  //Recupration des donnees a envoye..
  //TODO
  onSubmitForm(id_Reponse: string) {
    //Event de l'Event avec string et indice
    this.eventService.emit_Event_Update_({
      type: EventType.COMMENTER__REPONSE_BUG,
      data_paylode_Donnee_String: this.commentaire,
      data_paylode_String: id_Reponse,
    });
    this.commentaire = '';
  }
  //Methode pour supprimer la reponse ..
  //TODO
  onDelete(id_Reponse: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.DELETE_REPONSE_BUG,
      data_paylode_String: id_Reponse,
    });
  }
}
