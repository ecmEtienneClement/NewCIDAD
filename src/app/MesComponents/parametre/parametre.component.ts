import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { ModelReauthVueDialogComponent } from '../model-reauth-vue-dialog/model-reauth-vue-dialog.component';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';
//....

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css'],
})
export class ParametreComponent implements OnInit, OnDestroy {
  //Desactive le btn valider avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;
  subscriptionVerificationCode: Subscription = new Subscription();
  //Variable pour le nombre de tentative
  nbrTentative: number = 3;

  Id_User_Connected: string = '';
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private user: UserService,
    private eventService: EmitEvent,
    private gard: GardGuard,
    private _snackBar: MatSnackBar //  private location: Location
  ) {}

  //Mise en place des variables ..
  //TODO
  //mdp Comment au form le mot de passe user
  mdpUser: string;
  //La valeur du code qui a etait recuperer dans la base de donne
  codeUserbd: any;
  //Variable pour modif code
  ancienCode: any = '';
  nouveauCode: any = '';
  //Variable pour reini code
  mailReiniCode: string = '';
  user_Email_Connect: string | null;
  //form pour modif email
  formUpdateEmail: FormGroup;
  //form pour modif mdp
  formUpdateMdp: FormGroup;
  //Variable pour la securite
  securite: string = 'true';

  ngOnInit(): void {
    //InitFormUpdateMail
    //TODO
    this.initFormUpdateEmail();
    //InitFormUpdateMdp
    //TODO
    this.initFormUpdateMdp();

    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
    this.user_Email_Connect = this.gard.user_Email_Connect;
    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        this.data_Charger = true;
        this.codeUserbd = data_User.code;
        this.securite = data_User.securite;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });

    //Subsciption Pour la verification du code ...
    //TODO
    this.subscriptionVerificationCode = this.subscriptionVerificationCode =
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          //Transmission des donnees a la methode traitement ...
          this.traitementSubcriptionCode(data_Event);
        }
      );
  }
  /*.....................................METHODE............................... */
  traitementSubcriptionCode(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VERIFICATION_CODE:
        //appelle pour la verification
        this.verifyReponseEvent(data_Event.data_paylode_Number);
        break;
    }
  }
  verifyReponseEvent(reponse: number | undefined) {
    if (reponse == 1) {
      this.dialog.closeAll();
      this.submitReiniCode();
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
        //      this.route.navigate(['/parametre']);
      }
    }
  }

  //Methode Submit pour soumetre les modifications du code
  //TODO
  submitModifierCode() {
    if (this.ancienCode == this.codeUserbd) {
      //Creation de firestore pour la modification des informations du user
      //TODO
      firebase
        .firestore()
        .collection('user')
        .doc(this.Id_User_Connected)
        .update({
          code: this.nouveauCode,
        })

        .then(() => {
          const message =
            'Modification du code enregistrée ! La page sera actualisée dans 2s';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          //Attendre 3s avant Actualisation de la page
          setTimeout(() => {
            this.refresh();
          }, 3000);
        })
        .catch((error) => {
          alert("une erreur s'est produite ...");
        });
    } else {
      alert('Votre ancien code est incorrect !');
    }
  }
  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUser() {
    //Popope pour le code
    this.openDialog();
  }
  //Methode Submit pour soumetre la reinitialisation du code
  //TODO
  submitReiniCode() {
    if (this.mailReiniCode == this.user_Email_Connect) {
      //Creation de firestore pour la reinitialisation du code du user
      //TODO
      firebase
        .firestore()
        .collection('user')
        .doc(this.Id_User_Connected)
        .update({
          code: 1234,
        })

        .then(() => {
          const message =
            'Votre code a était bien réinitialiser à 1234 ! La page sera actualisée dans 2s';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          //Attendre 3s avant Actualisation de la page
          setTimeout(() => {
            this.refresh();
          }, 3000);
        })
        .catch((error) => {
          alert("une erreur s'est produite ...");
        });
    } else {
      alert('Votre mail est incorrecte !');
    }
  }
  //Methode Submit pour soumetre la modification du mail
  //TODO
  submitModifEmail() {
    const value = this.formUpdateEmail.value;
    const email = value['email'];
    const newEmail = value['newEmail'];
    const mdp = value['mdpUpdateMail'];
    this.authService
      .updateMail(email, newEmail, mdp)
      .then(() => {
        const message =
          'Votre mail a était bien modifié ! La page sera actualisée dans 2s';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        //Attendre 3s avant Actualisation de la page
        setTimeout(() => {
          this.refresh();
        }, 3000);
      })
      .catch((error) => {
        alert('Erreur ! Veillez bien verifié votre mail saisi');
      });
  }
  //Methode Submit pour soumetre la modification du mot de passe
  //TODO
  submitmodifmdp() {
    const value = this.formUpdateMdp.value;
    const emailmodifmdp = value['emailmodifmdp'];
    const mdpModif = value['mdpModif'];
    const newMdpModif = value['newMdpModif'];
    this.authService
      .updatePassword(emailmodifmdp, mdpModif, newMdpModif)
      .then(() => {
        const message =
          'Votre mot de passe a était bien modifié ! La page sera actualisée dans 2s';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        //Attendre 3s avant Actualisation de la page
        setTimeout(() => {
          this.refresh();
        }, 3000);
      })
      .catch((error) => {
        alert('Erreur ! Veillez bien verifié votre mail ou mot de passe saisi');
      });
  }
  //Methode pour modifier la securite..
  //TODO
  submitModifierSecurite() {
    //Creation de firestore pour la reinitialisation du code du user
    //TODO
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        securite: this.securite,
      })

      .then(() => {
        const message =
          'Votre Mode de securité a était bien modifié ! La page sera actualisée dans 2s';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        //Attendre 3s avant Actualisation de la page
        setTimeout(() => {
          this.refresh();
        }, 3000);
      })
      .catch((error) => {
        alert("une erreur s'est produite ...");
      });
  }
  //Initialisation formModifEmail
  //TODO
  initFormUpdateEmail() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formUpdateEmail = this.formBuilder.group({
      email: [mailUser, [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]],
      mdpUpdateMail: ['', Validators.required],
    });
  }

  //Initialisation formModifMdp
  //TODO
  initFormUpdateMdp() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formUpdateMdp = this.formBuilder.group({
      emailmodifmdp: [mailUser, [Validators.required, Validators.email]],
      mdpModif: ['', Validators.required],
      newMdpModif: ['', Validators.required],
    });
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //Methode pour la demande de code
  //TODO
  openDialog() {
    this.dialog.open(ModelReauthVueDialogComponent);
  }
  //Methode pour rafraichire la page ...
  //TODO
  refresh(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subscriptionVerificationCode.unsubscribe();
  }
}
