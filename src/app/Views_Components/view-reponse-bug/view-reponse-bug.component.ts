import { Component, Input } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventType } from 'src/app/Models/eventAction';
import { ReponseBugModel } from 'src/app/Models/reponseBug';

@Component({
  selector: 'app-view-reponse-bug',
  templateUrl: './view-reponse-bug.component.html',
  styleUrls: ['./view-reponse-bug.component.css'],
})
export class ViewReponseBugComponent {
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
  //TODO
  onCheck(indice: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.CHEKED_REPONSE_BUG,
      data_paylode_Number: indice,
      data_paylode_PageNavigate: this.page,
    });
  }
  //Recupration des donnees a envoye..
  //TODO
  onSubmitForm(indice: number) {
    //Event de l'Event avec string et indice
    this.eventService.emit_Event_Update_({
      type: EventType.COMMENTER__REPONSE_BUG,
      data_paylode_Number: indice,
      data_paylode_String: this.commentaire,
      data_paylode_PageNavigate: this.page,
    });
    this.commentaire = '';
  }
  //Methode pour supprimer la reponse ..
  //TODO
  onDelete(indice: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.DELETE_REPONSE_BUG,
      data_paylode_Number: indice,
      data_paylode_PageNavigate: this.page,
    });
  }
}
