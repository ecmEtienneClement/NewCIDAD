import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BugModel } from '../Models/bug';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReponseBugService } from './reponseBug.Service';
import { Notification } from './notification.service';

@Injectable()
export class BugService {
  constructor(
    private route: Router,
    private _snackBar: MatSnackBar,
    private notify: Notification,
    private serviceReponseBug: ReponseBugService
  ) {}
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
  createNewBug(
    language: string,
    titre: string,
    details: string,
    codeBug: string[]
  ) {
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
      'Non Résolu',
      0,
      Date.now(),
      codeBug
    );
    this.tbBugService.unshift(newBug);
    this.sauvegardeBase();
    this.updatetbBugService();
    this.notify.notifyNewBug();
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
    etat: string,
    codeBug: string[]
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
      Date.now(),
      codeBug
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
        //Avant on verifie d'abord s'il na pas une autre reponse dont checked is true ...
        //Avant de changer l'etat qui sera verifier par servicereponseBug
        const nbrReponseCheked: number =
          this.serviceReponseBug.verifyCheckedReponse(id_Bug);
        //Cas ou etat est non resolu allant vers resolu et qu'il n'a aucune reponse coche
        if (
          this.tbBugService[index].etat == 'Non Résolu' &&
          nbrReponseCheked == 0
        ) {
          const message = `OUPS ! Nous constatons que vous n'avez cocher aucune réponse vous y serez redirigé dans 2s pour nous signalez la bonne réponse merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        } //Cas ou etat est egal a  Resolu allans ver Non resoldu et qu'il y'a des reponse coche
        if (
          this.tbBugService[index].etat == 'Résolu' &&
          nbrReponseCheked != 0
        ) {
          const message = `OUPS ! Nous constatons que vous avez cocher ${nbrReponseCheked} réponse (s) vous y serez redirigé dans 2s pour les décochée (s) merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
      }
    });
  }
  //Methode por changer l'etat du bug si le user dit merci a au moin une reponse ....
  //TODO
  onChangeEtatBugByCheckedIsTrue(id_Bug: string) {
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        if (this.tbBugService[index].etat == 'Non Résolu') {
          this.tbBugService[index].etat = 'Résolu';
          this.sauvegardeBase();
          this.updatetbBugService();
          const message = `L'etat du Post a été bien modifié à : ${this.tbBugService[index].etat} apres votre remerciement !`;
          setTimeout(() => {
            //Affichage de l'alerte le temps qu'il ferme la premiere alert ...
            this.openSnackBar(message, 'ECM');
          }, 3000);
        }
      }
    });
  }
  //Methode por changer l'etat du bug si le user dit merci a au moin une reponse ....
  //TODO
  onChangeEtatBugByCheckedIsFalse(id_Bug: string): boolean {
    let changementEtatBugCmpSolo: boolean = false;
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        //Avant on verifie d'abord s'il na pas une autre reponse dont checked is true ...
        //Avant de changer l'etat qui sera verifier par servicereponseBug
        const nbrReponseCheked: number =
          this.serviceReponseBug.verifyCheckedReponse(id_Bug);

        //Le cas le nbrRponse est egal a = 0
        if (nbrReponseCheked == 0) {
          this.tbBugService[index].etat = 'Non Résolu';
          //Il y plus de reponse coche donc l'etat du bugCmp afficher doit etre changer a Non Résolu
          changementEtatBugCmpSolo = true;
          const message = `ATTENTION !!!  l'etat du Post a été modifié à : ${this.tbBugService[index].etat} car vous n'avez cocher aucune autre réponse !`;
          setTimeout(() => {
            //Affichage de l'alerte le temps qu'il ferme la premiere alert ...
            this.openSnackBar(message, 'ECM');
          }, 3000);
        }
        //Le cas le nbrRponse est superieur a = 0
        else {
          //Il y'a tjr une reponse cocheé donc l'etat du bug ne sera pas changer
          changementEtatBugCmpSolo = false;
          const message = `ATTENTION !!!  l'etat du Post est toujour à : ${this.tbBugService[index].etat}  car vous avez ${nbrReponseCheked} réponse (s) cochée (s) !`;
          setTimeout(() => {
            //Affichage de l'alerte le temps qu'il ferme la premiere alert ...
            this.openSnackBar(message, 'ECM');
          }, 3000);
        }
        this.sauvegardeBase();
        //  this.updatetbBugService();
      }
    });
    return changementEtatBugCmpSolo;
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
