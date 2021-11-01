import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BugModel } from '../Models/bug';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReponseBugService } from './reponseBug.Service';
import { GardGuard } from './gard.guard';
import { Notification } from './notification.service';
import { ReponseBugModel } from '../Models/reponseBug';
import { ErrorService } from './error.Service';

@Injectable()
export class BugService {
  subscriptionEvent: any;
  constructor(
    private route: Router,
    private _snackBar: MatSnackBar,
    private serviceReponseBug: ReponseBugService,
    private gardService: GardGuard,
    private notificationService: Notification,
    private errorNotifyService: ErrorService
  ) {}
  //....Partie Observable du tbBugService
  tbSubjectBugService: Subject<BugModel[]> = new Subject<BugModel[]>();
  private tbBugService: BugModel[] = [];
  etatConnexion: boolean = false;

  updatetbBugService() {
    this.tbSubjectBugService.next(this.tbBugService);
  }
  //....................

  //...Partie d'ajout d'un nouveau Bug
  //TODO
  createNewBug(
    language: string,
    titre: string,
    details: string,
    codeBug: string[]
  ) {
    //User_Id
    const user_Id = this.gardService.user_Id_Connect;
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
    this.sauvegardeBase()
      .then(() => {
        const message = 'Le Post a été bien publié !';
        this.openSnackBar(message, 'ECM');
      })
      .catch(() => {
        const message =
          "Une erreur c'est produite l'or de la publication du Post  !";
        this.openSnackBar(message, 'ECM');
      });
    if (!this.etatConnexion) {
      const message =
        'Probléme de connexion ! le Post est sauvegardé en locale suivre les deux indications  suivantes ... ';
      this.openSnackBar(message, 'ECM');
      setTimeout(() => {
        const message2 =
          'Indication 01 : Si vous actualisé pour rétablire la connexion alors reEnregistre a nouveau le Post !';
        this.openSnackBar(message2, 'ECM');
      }, 10000);
      setTimeout(() => {
        const message3 =
          "Indication 02 : Si vous rétablisez la connexion sans actualisé alors les données serons enregistrés automatiquement vous aurez plus a reprendre l'enrgistrement du Post !";
        this.openSnackBar(message3, 'ECM');
      }, 20000);
    }
    this.notificationService.notifyNewBug();
  }
  //Methode pour afficher la notification d'une nouvelle reponse
  //TODO
  notifyNewReponseAlert(id_Bug: string) {
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService[index].newReponse = true;
      }
    });
    this.sauvegardeBase();
    this.updatetbBugService();
  }
  //Methode pour afficher la notification d'un nouveau commentaire
  //TODO
  notifyNewCommentaireAlert(objReponseReturn: ReponseBugModel) {
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objReponseReturn.bug_Id) {
        const index: number = this.tbBugService.indexOf(element);
        //passage du tbcommentaireUser de la reponse au bug pour que le bug puis identifier les concernés pour
        //l'alerte d'un new commentaire
        this.tbBugService[index].tbcommentaireUser =
          objReponseReturn.tbcommentaireUser;
        //et de mm que tbViewCommentaire
        this.tbBugService[index].tbViewcommentaireUser =
          objReponseReturn.tbViewcommentaireUser;
      }
    });
    this.sauvegardeBase();
    this.updatetbBugService();
  }
  //.....
  //...Partie UpdateBug d'un nouveau Bug
  //NAVEUPDATEBUG
  //TODO
  navUpdateBug(objBug: BugModel) {
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        const index: number = this.tbBugService.indexOf(element);
        this.route.navigate(['/ecm', objBug.user_Id, 'modifier', index]);
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
  //Methode pour changer l'etat du bug
  //TODO
  onChangeEtatBug(objBug: BugModel): boolean {
    //On verifier si cette action est bien declancher par le proprietaire du post
    let userIdRepondant = this.gardService.user_Id_Connect;
    if (userIdRepondant !== objBug.user_Id) {
      this.errorNotifyService.notifyActionNonPermise('cet post');
      return false;
    }
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        const index: number = this.tbBugService.indexOf(element);
        //Avant on verifie d'abord s'il na pas une autre reponse dont checked is true ...
        //Avant de changer l'etat qui sera verifier par servicereponseBug
        const nbrReponseCheked: number =
          this.serviceReponseBug.verifyCheckedReponse(objBug.bug_Id);
        //Cas ou etat est non resolu allant vers resolu et qu'il n'a aucune reponse coche
        if (objBug.etat == 'Non Résolu' && nbrReponseCheked == 0) {
          const message = `OUPS ! Nous constatons que vous n'avez cocher aucune réponse vous y serez redirigé dans 2s pour nous signalez la bonne réponse merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        } //Cas ou etat est egal a  Resolu allans ver Non resoldu et qu'il y'a des reponse coche

        if (objBug.etat == 'Résolu' && nbrReponseCheked != 0) {
          const message = `OUPS ! Nous constatons que vous avez cocher ${nbrReponseCheked} réponse (s) vous y serez redirigé dans 2s pour les décochée (s) merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
        if (objBug.etat == 'Résolu' && nbrReponseCheked == 0) {
          const message = `OUPS ! La bonne réponse a était supprimée par le propriétaire vous avez ${nbrReponseCheked} réponse cochée vous y serez redirigé dans 2s pour constater merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
        if (objBug.etat == 'Non Résolu' && nbrReponseCheked != 0) {
          const message = `OUPS ! Bizzare que l'état reste a Non Résolu et pourtant vous avez ${nbrReponseCheked} réponse cochée vous y serez redirigé dans 2s pour constater merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
      }
    });
    return true;
  }
  //Methode pour verifier le changement l'etat du bug si tt les reponses sont suprimeés
  //TODO
  onVerifyChangeEtatBug(id_Bug: string) {
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService[index].etat = 'Non Résolu';
        this.sauvegardeBase();
        this.updatetbBugService();
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
  onNavigate(objBug: BugModel) {
    let userIdRepondant = this.gardService.user_Id_Connect;
    let index: number = 0;
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        index = this.tbBugService.indexOf(element);
        if (
          //verifi si le user n'a pas déja vue le post
          !objBug.tbViewUser.includes(userIdRepondant)
        ) {
          objBug.tbViewUser.unshift(userIdRepondant);
        }
        if (
          //verifi si le user n'a pas déja vue le post pour le commentaire
          //on marque le commentaire vue et arrette l'alert du commentaire
          !objBug.tbViewcommentaireUser.includes(userIdRepondant)
        ) {
          objBug.tbViewcommentaireUser.unshift(userIdRepondant);
        }
        //Verifi si le user qui navigue est le proprietair du bug avant d'effacer la notification
        if (userIdRepondant == objBug.user_Id) {
          //on marque le message vue et arrette l'alert du message
          objBug.newReponse = false;
        }
      }
    });
    this.sauvegardeBase();
    this.updatetbBugService();
    this.route.navigate(['/ecm', 'details', index]);
  }
  //.....voir les details
  //TODO
  onViewNewReponseAndCommentaireOnlyne(objBug: BugModel) {
    let userIdRepondant = this.gardService.user_Id_Connect;

    if (
      //verifi si le user n'a pas déja vue le post pour le commentaire
      //on marque le commentaire vue et arrette l'alert du commentaire
      !objBug.tbViewcommentaireUser.includes(userIdRepondant)
    ) {
      objBug.tbViewcommentaireUser.unshift(userIdRepondant);
    }
    //Verifi si le user qui navigue est le proprietair du bug avant d'effacer la notification
    if (userIdRepondant == objBug.user_Id) {
      //on marque le message vue et arrette l'alert du message
      objBug.newReponse = false;
    }

    this.sauvegardeBase();
    this.updatetbBugService();
  }
  //...Partie Delete Bug
  //TODO
  deleteBug(objBug: BugModel): boolean {
    //On verifier si cette action est bien declancher par le proprietaire du post
    let userIdRepondant = this.gardService.user_Id_Connect;
    if (userIdRepondant !== objBug.user_Id) {
        this.errorNotifyService.notifyActionNonPermise('cet post');
      return false;
    }
    let trouver: boolean = false;
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        trouver = true;
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService.splice(index, 1);
        this.serviceReponseBug
          .DeleteReponseBugDeleteBug(objBug.bug_Id)
          .then(() => {
            this.sauvegardeBase();
            this.updatetbBugService();
            const message = 'Le Post a été bien supprimé !';
            //Affichage de l'alerte
            this.openSnackBar(message, 'ECM');
          })
          .catch(() => {
            const message =
              'Oups erreur inattendue de delete reponsebug ... delete bug !';
            //Affichage de l'alerte
            this.openSnackBar(message, 'ECM');
          });
      }
    });
    if (!trouver) {
      const message = 'Oups erreur inattendue de delete bug !';
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
    }
    return true;
  }
  //...Partie de la suppression compte du User
  //TODO
  deleteBugTotalUserDeleteCompte(id_User: string): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        let tbfilterBug =
          this.tbBugService.filter(
            (Bug: { user_Id: string | undefined }) => Bug.user_Id !== id_User
          ).length !== 0
            ? this.tbBugService.filter(
                (Bug: { user_Id: string | undefined }) =>
                  Bug.user_Id !== id_User
              )
            : [];
        let nbrBugDelete: number =
          this.tbBugService.length - tbfilterBug.length;
        this.tbBugService = tbfilterBug;
        this.sauvegardeBase();
        this.updatetbBugService();
        resolve(nbrBugDelete);
      } catch (error) {
        reject(error);
      }
    });
  }
  //...............PARTIE DE LA BASE DE DONNEE FIREBASE...............

  //...Sauvegarde de la base de donnee
  //TODO
  async sauvegardeBase(): Promise<boolean> {
    firebase
      .database()
      .ref('.info/connected')
      .on('value', (data_Etat_Connexion) => {
        this.etatConnexion = data_Etat_Connexion.val();
      });
    return await firebase
      .database()
      .ref('/bdBug')
      .set(this.tbBugService)
      .then(() => {
        console.log('sauvegardeBase success ...');
        return true;
      })
      .catch((error) => {
        return false;
      });
  }
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
  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //...
}
