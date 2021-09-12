import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
import { BugModel } from 'src/app/Models/bug';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  reponse: string = '';
  bugCmp: any = new BugModel('id', '', '', '', '', '', 0, Date.now());
  //tbReponseCmp: any;
  indice: number;
  tbGeneralDBReponseBug: any = [];
  tbReponseBug: any = [];
  totalPage: number = 0;

  subscription: Subscription = new Subscription();
  subscriptionTbReponse: Subscription = new Subscription();
  user_Id_Connect: string;
  user_Id_Bug: string;

  constructor(
    private extra: ActivatedRoute,
    private eventEmit: EmitEvent,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private authService: GardGuard
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    //...Recuperation de l'indice via l'url
    //TODO
    this.indice = this.extra.snapshot.params['indice'];

    //.......Recuperation du soloBug
    //TODO
    // this.serviceBug.recupbase();
    this.serviceBug
      .recupbaseSoloBug(this.indice)
      .then((data_value: any) => {
        this.bugCmp = data_value;
        this.user_Id_Bug = data_value.user_Id;
        //  console.log('call by subsBug .....');
        //Apelle de la methode filtre suite a l'arrivees des donnees ...
        this.filterTbReponse();
      })
      .catch((error) => {
        alert('Une erreur est survenue recup Bug ...!');
        console.log('Une erreur est survenue recup bug ==>' + error);
      });
    ///Recuperation du tbReponsesBug dans base de donnee ..
    //TODO
    //  this.serviceReponseBug.recupeBaseReponse();
    //Abonnement pour recuperer le TbBug ...
    this.subscriptionTbReponse =
      this.serviceReponseBug.tbsubjectReponse.subscribe(
        (data_Value) => {
          //Recuperation du tbGeneral de la base de donnee
          //  this.tbGeneralDBReponseBug = data_Value ? data_Value : [];
          this.tbGeneralDBReponseBug = this.tbReponseBug = data_Value
            ? data_Value
            : [];

          this.totalPage = this.tbReponseBug.length;
          //   console.log('call by substbReponse .....');
          //Apelle de la methode filtre suite a l'arrivees des donnees ...
          this.filterTbReponse();
        },
        (error) => {
          alert('Une erreur est survenue recup base reponse !');
        }
      );
    //Update tbReponse
    //TODO
    this.serviceReponseBug.updateTbReponseBug();
    //Abonnement pour les EventEmit evennements  ...
    //TODO
    this.subscription = this.eventEmit.emitEventSubjectBug.subscribe(
      (data_Event: EventModel) => {
        this.traintementEmitEvent(data_Event);
      }
    );
  }
  //Filtrage du tbReponse pour afficher les reponses concernant a ce bug par ID
  //Cette fontion sera appeller  au moin deux fois car elle est constituer de deux elements
  //asynchrones pour le filtrage du tb qui sont le tbReponse et bugCmp.bug_Id
  //TODO
  filterTbReponse() {
    this.tbReponseBug =
      this.tbGeneralDBReponseBug.filter(
        (reponse: { bug_Id: string }) => reponse.bug_Id == this.bugCmp.bug_Id
      ).length != 0
        ? this.tbGeneralDBReponseBug.filter(
            (reponse: { bug_Id: string }) =>
              reponse.bug_Id == this.bugCmp.bug_Id
          )
        : [];

    //console.log('length ' + this.tbGeneralDBReponseBug.length);
    //page total pour la pagination
    this.totalPage = this.tbReponseBug.length;
  }

  //.....
  //...Enregistrement de la reponse Bug ...
  //TODO
  onSubmitForm() {
    this.serviceReponseBug.creatNewReponseBug(this.bugCmp.bug_Id, this.reponse);
    this.reponse = '';
  }
  //...Suppression de la reponse Bug ...
  //TODO
  onResetForm() {
    this.reponse = '';
  }
  //.........
  /*
   Verification de l'evenement afin de le traite avec la bonne methode ..
   ..................TRAITEMENT DES EVENEMENTS ..................
 */

  //TODO
  traintementEmitEvent(event: EventModel) {
    switch (event.type) {
      case EventType.COMMENTER__REPONSE_BUG:
        this.onCommenter(
          event.data_paylode_Number,
          event.data_paylode_PageNavigate,
          event.data_paylode_String
        );
        break;
      case EventType.CHEKED_REPONSE_BUG:
        this.onCheckReponseBug(
          event.data_paylode_Number,
          event.data_paylode_PageNavigate
        );
        break;
      case EventType.DELETE_REPONSE_BUG:
        this.onDeleteReponseBug(
          event.data_paylode_Number,
          event.data_paylode_PageNavigate
        );
        break;
    }
  }

  /*
  
   .............................TRAITEMENT DES METHODES ................. ..................
 */

  //Methode pour Checked la reponse bug
  //TODO
  onCheckReponseBug(indice: number, page: number = 1) {
    //Voir commentaire ECM pour comprendre calcule de l'indice ...
    //Voir au viewReponseBug le itemsPerPage = 10
    indice += 10 * (page - 1);
    //Recuperation son ID voir commentaire serviceReponse Bug pour comprendre les raisons..
    const id_Reponse: string = this.tbReponseBug[indice].id_Reponse;
    this.serviceReponseBug.onCheckReponseBug(id_Reponse);
  
  }

  //Ajout du commentaire dans le tbcommentaire de la reponse ...
  //TODO
  onCommenter(indice: number, page: number = 1, commentaire?: string) {
    //Voir commentaire ECM pour comprendre calcule de l'indice ...
    //Voir au viewReponseBug le itemsPerPage = 10
    indice += 10 * (page - 1);
    //Recuperation son ID voir commentaire serviceReponse Bug pour comprendre les raisons..
    const id_Reponse: string = this.tbReponseBug[indice].id_Reponse;
    this.serviceReponseBug.addCommentaireReponseBug(id_Reponse, commentaire);
  }
  //Methode pour supprimer la reponse bug
  //TODO
  onDeleteReponseBug(indice: number, page: number = 1) {
    //Voir commentaire ECM pour comprendre calcule de l'indice ...
    //Voir au viewReponseBug le itemsPerPage = 10
    indice += 10 * (page - 1);
    //Recuperation son ID voir commentaire serviceReponse Bug pour comprendre les raisons..
    const id_Reponse: string = this.tbReponseBug[indice].id_Reponse;
    this.serviceReponseBug.DeleteReponseBug(id_Reponse);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionTbReponse.unsubscribe();
    alert('detail detruite');
    console.log('subscriptionEvent détruite ...');
    console.log('subscriptionTbReponse détruite ...');
  }
}
