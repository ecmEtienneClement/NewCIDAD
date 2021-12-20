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
// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  //Desactive le btn Modifier avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;
  fileIsUploading: boolean = false;
  newNom: string = '';
  newPrenom: string = '';
  newPromo: string = '';
  newPpUser: string = '';
  newModeNav: string = 'false';
  securiteUser: string = 'true';
  subscriptionVerificationCode: Subscription = new Subscription();
  newUrl: string = '';
  urlChanged: boolean = false;
  onUpdateChecked: boolean = false;
  Id_User_Connected: string = '';
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;
  constructor(
    private userService: UserService,
    private gard: GardGuard,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventService: EmitEvent,
    private route: Router,
    private notifyService: ErrorService
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;

    //recuperation des information du User Connected
    //TODO
    this.userService.VerifyLocaleStorage().then((data_ObjUser) => {
      this.newNom = data_ObjUser.nom;
      this.newPrenom = data_ObjUser.prenom;
      this.newPromo = data_ObjUser.promotion;
      this.newModeNav = data_ObjUser.fantome;
      this.securiteUser = data_ObjUser.securite;
      this.newPpUser = data_ObjUser.ppUser;
      this.data_Charger = true;
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
        const message = `Votre code est incorrect ! tentative (s) restante (s) ${this.nbrTentative}`;
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
  //TODO
  onUpdateUser() {
    this.onUpdateChecked = true;
    //On verifie si le pp est changer
    if (this.urlChanged) {
      this.userService
        .onDeletePpUser(this.newPpUser)
        .then(() => {
          this.onSave(this.newUrl);
        })
        .catch(() => {
          this.notifyService.notifyAlertErrorDefault(
            "Une erreur s'est produite ! Vérifier votre connexion si l'erreur persiste actualisé et reprendre le processus"
          );
        });
    } else {
      this.onSave(this.newPpUser);
    }
  }
  onSave(ppUserParams: string) {
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
        ppUser: ppUserParams,
      })
      .then(() => {
        //TODO
        this.userService.updateInfoUserLocal();
        this.masqueImageCharger();
        const message = 'Modification(s) enregistrée(s) !';
        //Affichage de l'alert
        this.openSnackBar(message, 'ECM');
      })
      .catch(() => {
        this.notifyService.notifyAlertErrorDefault(
          "Une erreur s'est produite ! Vérifier votre connexion si l'erreur persiste actualisé et reprendre le processus"
        );
      });
  }
  //Methode pour modifer le pp du user
  //TODO
  onChangePpUser(file: File) {
    this.animChargementPp();
    this.fileIsUploading = true;
    this.userService
      .onSavePpUser(file)
      .then((url: string) => {
        this.newUrl = url;
        this.fileIsUploading = false;
        this.urlChanged = true;
        this.stopAnimChargementPp();
        this.afficheImageCharger();
      })
      .catch(() => {
        this.notifyService.notifyAlertErrorDefault(
          "Une erreur s'est produite l'or du chargement de l'image ! Vérifier votre connexion si l'erreur persiste actualisé et reprendre le processus"
        );
      });
  }
  //Methode detecte File
  //TODO
  detectFiles(event: any) {
    this.onChangePpUser(event.target.files[0]);
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
  //Methode pour animer le chargement de la photo
  //TODO
  animChargementPp() {
    let instance = gsap.timeline();
    instance.to('.chargement', {
      duration: 1,
      visibility: 'visible',
    });
    instance.to('.chargement .icone-chargement span', {
      scaleY: 5,
      duration: 0.25,
      stagger: 0.1,
      repeat: -1,
    });
    instance.to('.chargement .txt-chargement b', {
      duration: 3,
      text: 'Chargement Image Profil ...',
      repeat: -1,
    });
  }
  //Methode pour animer le chargement de la photo
  //TODO
  stopAnimChargementPp() {
    let instance = gsap.timeline();
    instance.to('.chargement', {
      duration: 1,
      visibility: 'hidden',
    });
  }
  //Methode pour afficher que l'image est charger
  //TODO
  afficheImageCharger() {
    let instance = gsap.timeline();
    instance.to('.succefulChargement', {
      duration: 1,
      visibility: 'visible',
    });
  } //Methode pour masquer que l'image est charger
  //TODO
  masqueImageCharger() {
    let instance = gsap.timeline();
    instance.to('.succefulChargement', {
      duration: 1,
      visibility: 'hidden',
    });
  }

  ngOnDestroy(): void {
    this.subscriptionVerificationCode.unsubscribe();
    //On verifie si le pp est changer est modification non enregistrer
    if (this.urlChanged && !this.onUpdateChecked) {
      this.userService
        .onDeletePpUser(this.newUrl)
        .then(() => {
          alert(
            'Nous constont que vous avez charger une image sans enregistre'
          );
        })
        .catch(() => {
          alert('erreur delete destroy');
        });
    }
  }
}
