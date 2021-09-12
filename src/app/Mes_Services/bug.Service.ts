import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BugModel } from '../Models/bug';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BugService {
  constructor(private route: Router, private _snackBar: MatSnackBar) {}
  //....Partie Observable du tbBugService
  tbSubjectBugService: Subject<BugModel[]> = new Subject<BugModel[]>();
  private tbBugService: BugModel[];

  updatetbBugService() {
    this.tbSubjectBugService.next(this.tbBugService);
  }
  //....................
  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //...Partie d'ajout d'un nouveau Bug
  //TODO
  createNewBug(language: string, titre: string, details: string, etat: string) {
    //User_Id
    const user_Id = firebase.auth().currentUser?.uid;
    //Bug_Id
    const conceptionBug_Id = user_Id + Date.now().toString();
    const bug_Id = conceptionBug_Id.split(' ').join('%');
    //new Bugs
    const newBug = new BugModel(
      bug_Id,
      user_Id,
      language,
      titre,
      details,
      etat,
      0,
      Date.now()
    );
    this.tbBugService.unshift(newBug);
    this.sauvegardeBase();
    this.updatetbBugService();
    const message = 'Le Post a été bien publié !';
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }
  //.....
  //...Partie UpdateBug d'un nouveau Bug
  //NAVEUPDATEBUG
  //TODO
  navUpdateBug(id_Bug: string) {
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.route.navigate(['/ecm', 'modifier', index]);
      } else {
      }
    });
  }
  //TODO
  updatBug(
    bug: BugModel,
    indice: number,
    language: string,
    titre: string,
    details: string,
    etat: string
  ) {
    //Suppression du bug d'abord
    this.tbBugService.splice(indice, 1);
    //Creation d'un nouveau bug

    const bugUpdate = new BugModel(
      bug.bug_Id,
      bug.user_Id,
      language,
      titre,
      details,
      etat,
      1,
      Date.now()
    );

    //Enregistrement du nouveau modifier Bug ..
    this.tbBugService.unshift(bugUpdate);
    this.sauvegardeBase();
    this.updatetbBugService();
    const message = 'Le Post a été bien modifié !';
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }

  //Methode por changer l'etat du bug
  //TODO
  onChangeEtatBug(id_Bug: string) {
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService[index].etat =
          this.tbBugService[index].etat == 'Résolu' ? 'Non Résolu' : 'Résolu';
        this.sauvegardeBase();
        //  this.updatetbBugService();
        const message = `L'etat du Post a été bien modifié à : ${this.tbBugService[index].etat} !`;
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      } else {
      }
    });
  }
  //.....voir les details
  //TODO
  onNavigate(id_Bug: string) {
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.route.navigate(['/ecm', 'details', index]);
      } else {
      }
    });
  }

  //...Partie Delete Bug
  //TODO
  deleteBug(id_Bug: string) {
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService.splice(index, 1);
        this.sauvegardeBase();
        this.updatetbBugService();
        const message = 'Le Post a été bien supprimé !';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      } else {
      }
    });
  }
  //...............PARTIE DE LA BASE DE DONNEE FIREBASE...............

  //...Sauvegarde de la base de donnee
  //TODO
  sauvegardeBase() {
    firebase.database().ref('/bdBug').set(this.tbBugService);
    console.log('sauvegardeBase success ...');
  }
  //.....
  //.....Recuperation de la base de donnee..
  //TODO
  recupbase() {
    firebase
      .database()
      .ref('/bdBug')
      .on('value', (valueBd) => {
        this.tbBugService = valueBd.val() ? valueBd.val() : [];
        this.updatetbBugService();
      });
    console.log('recupbase success ...');
  }
  //...
  //.....Recuperation de la base de donnee d'un Bug solo..
  //TODO
  recupbaseSoloBug(indice: number) {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('/bdBug/' + indice)
        .once('value')
        .then(
          (data: any) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  //...
}
