import { Component, Input } from '@angular/core';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { BugModel } from 'src/app/Models/bug';
import { EventType } from 'src/app/Models/eventAction';

@Component({
  selector: 'app-view-bug',
  templateUrl: './view-bug.component.html',
  styleUrls: ['./view-bug.component.css'],
})
export class ViewBugComponent {
  @Input() prenom: string;
  @Input() nom: string;
  @Input() promo: string;
  @Input() fantome: boolean;
  @Input() tbCmpCh: BugModel[];
  @Input() user_Id_Connect: string;
  @Input() totalPage: number;
  page: number = 1;
  constructor(private eventService: EmitEvent) {}

  //Methode Pour Voir Les Informations du User
  //TODO
  onViewUser(user_Id: any) {
    this.eventService.emit_Event_Update_({
      type: EventType.VIEW_INFO_USER,
      data_paylode_Number: 0,
      data_paylode_String: user_Id,
    });
  }
  //Methode pour voir le nombre de reponses
  //TODO
  onViewNbrReponse(indice: number) {}
  //Methode Pour la Navigation vers la page details avec eventIndice et la page
  //TODO
  onNavigate(data_Paylod_Params: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.NAVIGATBUG,
      data_paylode_Number: data_Paylod_Params,
      data_paylode_PageNavigate: this.page,
    });
  }
  //Methode Pour la Modifirer le Bug avec eventBug
  //TODO
  onUpdateBug(data_Paylod_Params: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.UPDATEBUG,
      data_paylode_Number: data_Paylod_Params,
      data_paylode_PageNavigate: this.page,
    });
  }

  //Methode Pour la Modifirer l'etat du Bug eventBug
  //TODO
  onChangeEtatBug(data_Paylod_Params: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.CHANGEETATBUG,
      data_paylode_Number: data_Paylod_Params,
      data_paylode_PageNavigate: this.page,
    });
  }
  //Methode Pour la sauppression du Bug eventBug
  //TODO
  onDeletBug(data_Paylod_Params: number) {
    this.eventService.emit_Event_Update_({
      type: EventType.DELETEBUG,
      data_paylode_Number: data_Paylod_Params,
      data_paylode_PageNavigate: this.page,
    });
  }
}
