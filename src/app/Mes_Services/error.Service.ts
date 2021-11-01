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
  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
