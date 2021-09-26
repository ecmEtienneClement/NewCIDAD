import { Component, Input, OnInit } from '@angular/core';

import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { BugModel } from 'src/app/Models/bug';
import { EventType } from 'src/app/Models/eventAction';

@Component({
  selector: 'app-viewecm',
  templateUrl: './viewecm.component.html',
  styleUrls: ['./viewecm.component.css'],
})
export class ViewecmComponent implements OnInit {
  @Input() prenom: string;
  @Input() nom: string;
  @Input() promo: string;
  @Input() fantome: string;
  @Input() nbrReponse: number;
  @Input() nbrReponseCoche: number;
  @Input() tbCmpCh: BugModel[];
  @Input() user_Id_Connect?: string;
  @Input() totalPage: number;

  page: number = 1;
  //Variable pour les reglage d'annimation
  open_btn_details: boolean = false;
  open_btn: boolean = false;
  ligne_animation: boolean = true;
  constructor(private eventService: EmitEvent) {}
  ngOnInit(): void {}

  /*   
 ...............................PARTIE POUR REGLAGE D'AFFICHAGE ................ .........
 
*/
  //Methode pour sortir le boutton details...
  //TODO
  onOpenBtnDetails() {
    this.open_btn_details = !this.open_btn_details;
  }
  //Methode pour sortir la pallette des bouttons...
  //TODO
  openBlocBtn() {
    this.open_btn = !this.open_btn;
  }
  //Methode pour les lignes d'annimation ...
  //TODO
  ligneAnimation() {
    this.ligne_animation = !this.ligne_animation;
  }
  /*   
 ...............................PARTIE POUR LES EMISSION D'EVENEMENTS ................ .........
 
*/
  //Methode Pour Voir Les Informations du User
  //TODO
  onViewUser(user_Id: any) {
    this.eventService.emit_Event_Update_({
      type: EventType.VIEW_INFO_USER,
      data_paylode_String: user_Id,
    });
  }
  //Methode Pour la Navigation vers la page details avec eventIndice et la page
  //TODO
  onNavigate(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.NAVIGATBUG,
      data_paylode_String: idBug,
    });
  }
  //Methode pour voir le nombre de reponses
  //TODO
  onViewNbrReponse(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.NBR_REPONSE,
      data_paylode_String: idBug,
    });
  }

  //Methode Pour la Modifirer le Bug avec eventBug
  //TODO
  onUpdateBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.UPDATEBUG,
      data_paylode_String: idBug,
    });
  }

  //Methode Pour la Modifirer l'etat du Bug eventBug
  //TODO
  onChangeEtatBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.CHANGEETATBUG,
      data_paylode_String: idBug,
    });
  }
  //Methode Pour la sauppression du Bug eventBug
  //TODO
  onDeletBug(idBug: string) {
    this.eventService.emit_Event_Update_({
      type: EventType.DELETEBUG,
      data_paylode_String: idBug,
    });
  }
}
