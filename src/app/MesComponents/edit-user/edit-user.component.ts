import { Component, OnDestroy, OnInit } from '@angular/core';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogueCodeComponent } from '../alert-dialogue-code/alert-dialogue-code.component';
import { Subscription } from 'rxjs';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  //Desactive le btn Modifier avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;
  newNom: string = '';
  newPrenom: string = '';
  newPromo: string = '';
  newModeNav: string = 'false';
  securiteUser: string = 'true';
  subscriptionVerificationCode: Subscription = new Subscription();

  Id_User_Connected: string = '';
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;
  constructor(
    private user: UserService,
    private gard: GardGuard,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventService: EmitEvent,
    private route: Router
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        //Valeur des champs ...
        this.newNom = data_User.nom;
        this.newPrenom = data_User.prenom;
        this.newPromo = data_User.promotion;
        this.newModeNav = data_User.fantome;
        //...
        this.securiteUser = data_User.securite;
        this.data_Charger = true;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });

    //Subsciption Pour la verification du code
    //TODO
    this.subscriptionVerificationCode =
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          //Transmission des donnees a la methode traitement ..
          this.traitementSubcriptionCode(data_Event);
        }
      );
  }

 
  /* .............................................................................*/

  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser() {
    if (this.securiteUser == 'true') {
      //Popope pour le code
      this.openDialog();
    } else if (this.securiteUser == 'false') {
      //Passe directement a la suppression si le user n'a pas securiser son compte
      this.onUpdateUser();
    } else {
    }
  }
  //Methode pour le traitement des donnees de la subcription
  //TODO
  traitementSubcriptionCode(event: EventModel) {
    switch (event.type) {
      case EventType.VERIFICATION_CODE:
        //appelle pour la verification
        this.verifyReponseEvent(event.data_paylode_Number);
        break;
    }
  }
  //Verification de la reponse du Event si 1 good 0 is no good avant le update..
  //TODO
  verifyReponseEvent(reponse: number | undefined) {
    if (reponse == 1) {
      this.dialog.closeAll();
      this.onUpdateUser();
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
        this.route.navigate(['/parametre']);
      }
    }
  }
  //Methode pour la mise a jour des champs nom prenom promotion et fantome
  onUpdateUser() {
    //Creation de firestore pour la modification des informations du user
    //TODO
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        nom: this.newNom,
        prenom: this.newPrenom,
        promotion: this.newPromo,
        fantome: this.newModeNav,
      })

      .then(() => {
        const message = 'Modification (s) enregistrée (s) !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      })
      .catch((error) => {
        alert("une erreur s'est produite ...");
      });
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
    this.subscriptionVerificationCode.unsubscribe();
  }
}
