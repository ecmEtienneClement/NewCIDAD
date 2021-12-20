import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class ErrorService {
  messageDefault: string =
    'Une erreur est survenue veillez vérifier votre connexion !';
  constructor(private _snackBar: MatSnackBar) {}

  notifyAlertErrorDefault(message: string = this.messageDefault) {
    this.openSnackBar(message, 'ECM');
  }
  notifyActionNonPermise(messageParams: string) {
    const message = `Action non permise ! Nous constatons que vous n'est pas l'auteur de ${messageParams} ...`;
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }
  //Methode pour notifier des erreurs liees au token
  //TODO
  notifyToken() {
    const message = `Requête non autorisée ! Veillez générer un nouveau token`;
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }
  //Methode pour traiter les status des erreurs
  //TODO
  notySwitchErrorStatus(
    status: any,
    nameElement?: string,
    messageError?: string
  ) {
    switch (status) {
      case 401:
        setTimeout(() => {
          this.notifyToken();
        }, 5000);
        break;
      case 400:
        messageError?.length != 0
          ? this.notifyAlertErrorDefault(messageError)
          : this.notifyAlertErrorDefault();
        break;
      case 404:
        this.notifyAlertErrorDefault(`Cet ${nameElement} n'existe pas !`);
        break;
      case 500:
        this.notifyAlertErrorDefault(
          `Erreur inattendue ! Veillez reprendre le processus`
        );
        break;
    }
  }
  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
