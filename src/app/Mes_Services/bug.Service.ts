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
import { dbNameType, LocalService } from './local.Service';
import { EmitEvent } from './emitEvent.service';
import { EventType } from '../Models/eventAction';
import * as moment from 'moment';
moment.locale('fr');
@Injectable()
export class BugService {
  subscriptionEvent: any;
  constructor(
    private emitEventService: EmitEvent,
    private route: Router,
    private _snackBar: MatSnackBar,
    private serviceReponseBug: ReponseBugService,
    private gardService: GardGuard,
    private notificationService: Notification,
    private errorNotifyService: ErrorService,
    private localService: LocalService
  ) {}
  //....Partie Observable du tbBugService
  tbSubjectBugService: Subject<BugModel[]> = new Subject<BugModel[]>();
  tbSubjectLocalBugService: Subject<BugModel[]> = new Subject<BugModel[]>();
  private tbBugService: BugModel[];
  private tbLocalBugService: BugModel[];
  etatConnexion: boolean = false;

  updatetbBugService() {
    this.tbSubjectBugService.next(this.tbBugService);
  }
  updatetLocalbBugService() {
    this.tbSubjectLocalBugService.next(this.tbLocalBugService);
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
    let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
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
      'Non R??solu',
      0,
      dateSaved,
      codeBug
    );
    this.tbBugService.unshift(newBug);
    this.sauvegardeBase()
      .then(() => {
        const message = 'Le Post a ??t?? bien publi?? !';
        this.openSnackBar(message, 'ECM');
      })
      .catch(() => {
        const message =
          "Une erreur c'est produite l'or de la publication du Post  !";
        this.openSnackBar(message, 'ECM');
      });
    if (!this.etatConnexion) {
      const message =
        'Probl??me de connexion ! le Post est sauvegard?? en locale suivre les deux indications  suivantes ... ';
      this.openSnackBar(message, 'ECM');
      setTimeout(() => {
        const message2 =
          'Indication 01 : Si vous actualis?? pour r??tablire la connexion alors reEnregistre a nouveau le Post !';
        this.openSnackBar(message2, 'ECM');
      }, 10000);
      setTimeout(() => {
        const message3 =
          "Indication 02 : Si vous r??tablisez la connexion sans actualis?? alors les donn??es serons enregistr??s automatiquement vous aurez plus a reprendre l'enrgistrement du Post !";
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
        //passage du tbcommentaireUser de la reponse au bug pour que le bug puis identifier les concern??s pour
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
        this.route.navigate([
          '/ecm',
          objBug.user_Id,
          'modifier',
          index,
          objBug.bug_Id,
        ]);
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
    let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
    const bugUpdate = new BugModel(
      bug.bug_Id,
      bug.user_Id,
      language,
      titre,
      details,
      etat,
      1,
      dateSaved,
      codeBug
    );

    //Enregistrement du nouveau modifier Bug ..
    this.tbBugService.unshift(bugUpdate);
    this.sauvegardeBase();
    this.updatetbBugService();
    const message = 'Le Post a ??t?? bien modifi?? !';
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
        if (objBug.etat == 'Non R??solu' && nbrReponseCheked == 0) {
          const message = `OUPS ! Nous constatons que vous n'avez cocher aucune r??ponse vous y serez redirig?? dans 2s pour nous signalez la bonne r??ponse merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        } //Cas ou etat est egal a  Resolu allans ver Non resoldu et qu'il y'a des reponse coche

        if (objBug.etat == 'R??solu' && nbrReponseCheked != 0) {
          const message = `OUPS ! Nous constatons que vous avez cocher ${nbrReponseCheked} r??ponse (s) vous y serez redirig?? dans 2s pour les d??coch??e (s) merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
        if (objBug.etat == 'R??solu' && nbrReponseCheked == 0) {
          const message = `OUPS ! La bonne r??ponse a ??tait supprim??e par le propri??taire vous avez ${nbrReponseCheked} r??ponse coch??e vous y serez redirig?? dans 2s pour constater merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
        if (objBug.etat == 'Non R??solu' && nbrReponseCheked != 0) {
          const message = `OUPS ! Bizzare que l'??tat reste a Non R??solu et pourtant vous avez ${nbrReponseCheked} r??ponse coch??e vous y serez redirig?? dans 2s pour constater merci ...`;
          this.openSnackBar(message, 'ECM');
          setTimeout(() => {
            this.route.navigate(['/ecm', 'details', index]);
          }, 4000);
        }
      }
    });
    return true;
  }
  //Methode pour verifier le changement l'etat du bug si tt les reponses sont suprime??s
  //TODO
  onVerifyChangeEtatBug(id_Bug: string) {
    //Voir commentaire du service tbReponse
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == id_Bug) {
        const index: number = this.tbBugService.indexOf(element);
        this.tbBugService[index].etat = 'Non R??solu';
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
        if (this.tbBugService[index].etat == 'Non R??solu') {
          this.tbBugService[index].etat = 'R??solu';
          this.sauvegardeBase();
          this.updatetbBugService();
          const message = `L'etat du Post a ??t?? bien modifi?? ?? : ${this.tbBugService[index].etat} apres votre remerciement !`;
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
          this.tbBugService[index].etat = 'Non R??solu';
          //Il y plus de reponse coche donc l'etat du bugCmp afficher doit etre changer a Non R??solu
          changementEtatBugCmpSolo = true;
          const message = `ATTENTION !!!  l'etat du Post a ??t?? modifi?? ?? : ${this.tbBugService[index].etat} car vous n'avez cocher aucune autre r??ponse !`;
          setTimeout(() => {
            //Affichage de l'alerte le temps qu'il ferme la premiere alert ...
            this.openSnackBar(message, 'ECM');
          }, 3000);
        }
        //Le cas le nbrRponse est superieur a = 0
        else {
          //Il y'a tjr une reponse coche?? donc l'etat du bug ne sera pas changer
          changementEtatBugCmpSolo = false;
          const message = `ATTENTION !!!  l'etat du Post est toujour ?? : ${this.tbBugService[index].etat}  car vous avez ${nbrReponseCheked} r??ponse (s) coch??e (s) !`;
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
  onNavigate(objBug: BugModel): boolean {
    let userIdRepondant = this.gardService.user_Id_Connect;
    let index: number = 0;
    if (!this.verifyTbBugisNotundefined()) {
      this.onNavigateLocal(objBug);
      return false;
    }
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        index = this.tbBugService.indexOf(element);
        if (
          //verifi si le user n'a pas d??ja vue le post
          !objBug.tbViewUser.includes(userIdRepondant)
        ) {
          objBug.tbViewUser.unshift(userIdRepondant);
        }
        if (
          //verifi si le user n'a pas d??ja vue le post pour le commentaire
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
    return true;
  }
  onNavigateLocal(objBug: BugModel) {
    let index: number = 0;
    //Voir commentaire du service tbReponse pour comprendre les raisons d'utilisation de boucle
    this.tbLocalBugService.forEach((element) => {
      if (element.bug_Id == objBug.bug_Id) {
        index = this.tbLocalBugService.indexOf(element);
      }
    });
    this.route.navigate(['/ecm', 'details', index]);
  }
  //.....voir les details
  //TODO
  onViewNewReponseAndCommentaireOnlyne(objBug: BugModel) {
    let userIdRepondant = this.gardService.user_Id_Connect;

    if (
      //verifi si le user n'a pas d??ja vue le post pour le commentaire
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
            const message = 'Le Post a ??t?? bien supprim?? !';
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
  //Methode pour verifier si le tb est bien charger
  //TODO
  verifyTbBugisNotundefined(): boolean {
    if (this.tbBugService == null || this.tbBugService == undefined) {
      return false;
    }
    return true;
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
      .on(
        'value',
        (valueBd) => {
          this.tbBugService = valueBd.val() ? valueBd.val() : [];
          this.updatetbBugService();
          //this.sauvegardeDbBugCryptLocal();
          this.emitEventService.emit_Event_Update_({
            type: EventType.ANIM_NOTIFY_SUCCESS_BUG,
          });
        },
        () => {
          this.errorNotifyService.notifyAlertErrorDefault(
            'Erreur NV : 2 ! Veillez nous la signal??e '
          );
        }
      );
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
  //Methode pour la verification si le user est l'auteur de cet bug
  //TODO
  async verifyUserUpdateBug(
    id_Bug: string,
    id_User_Bug: string,
    indice: number
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      if (this.tbBugService) {
        let trouver: boolean = false;
        let valide: boolean = false;
        for (let index = 0; index < this.tbBugService.length; index++) {
          const element = this.tbBugService[index];
          if (element.bug_Id == id_Bug) {
            trouver = true;
            if (element.user_Id == id_User_Bug) {
              valide = true;
              return resolve(true);
            } else {
              alert(
                'Attention ! Cet post que vous tentez de modifi?? ne vous appartient pas !'
              );

              return reject(false);
            }
          }
        }

        if (!trouver) {
          this.errorNotifyService.notifyAlertErrorDefault(
            "Cet post n'existe pas !"
          );
          return reject(false);
        }
        if (!valide) {
          return reject(false);
        }
      } else {
        this.recupbaseSoloBug(indice)
          .then((dataBug: any) => {
            if (dataBug == null) {
              this.errorNotifyService.notifyAlertErrorDefault(
                "Cet post n'existe pas !"
              );

              return reject(false);
            }
            if (dataBug.user_Id != id_User_Bug) {
              alert(
                'Attention ! Cet post que vous tentez de modifi?? ne vous appartient pas !'
              );
              return reject(false);
            }
            resolve(true);
          })
          .catch(() => {
            this.errorNotifyService.notifyAlertErrorDefault();
            return reject(false);
          });
      }
    });
  }
  //Methode pour crypter et sauvegarder les donnees en local
  //TODO
  sauvegardeDbBugCryptLocal(): boolean {
    let pourcentageTb: number = 0;
    //Verification du modeLocal du User
    const modeLocalUserConnected: boolean | number =
      this.localService.verifyModeLocal();
    if (modeLocalUserConnected == true) {
      //Verification si la BD Bug est activer
      const checkedBug: boolean | number = this.localService.VerifyAppPost();
      if (checkedBug == true) {
        //Verifi si le tb est different de undif...
        if (this.tbBugService) {
          //recuperation du pourcentage
          let pourcentage =
            this.localService.getPoucentageDonneLocal('ECM_PB_B');
          //arret du processus si le pourcentage est egal a 0
          if (pourcentage == 0) {
            this.errorNotifyService.notifyAlertErrorDefault(
              "Mode local activer, mais pourcentage de sauvegarde de base non d??fini ! Veiller reconfigur?? l'environnement local "
            );
            return false;
          }
          //cas ou le pourcentage est de 75%
          if (pourcentage == 3) {
            pourcentageTb = Math.floor(this.tbBugService.length / 4) * 3;
          } else {
            //Arrondi la valeur pour ne op avoir des virgules
            pourcentageTb = Math.floor(this.tbBugService.length / pourcentage);
          }

          let i: number = 0;
          //Debut de la sauvegarde
          for (let index = 0; index < pourcentageTb; index++) {
            const elementBug = this.tbBugService[index];
            //ECM_Local
            let name: string = 'ECM_BB_' + i;
            localStorage.setItem(name, window.btoa(JSON.stringify(elementBug)));
            ++i;
          }
          this.localService.dataSavedDonneLocal(dbNameType.BUG);
          return true;
        } else {
          this.errorNotifyService.notifyAlertErrorDefault(
            "Bd App-Post n'est pas charg??e ! Veillez actualiser pour recharger la BD distante ou v??rifier votre connexion ..."
          );
        }
      }
    }
    return false;
  }
  //Methode pour recuperer les donnees en local
  //TODO
  recupDbBugCryptLocal(): boolean {
    //Verification du modeLocal du User
    const mode_Local_User_Connected = this.localService.verifyModeLocal();
    if (mode_Local_User_Connected == true) {
      //Verification si la BD Bug est activer
      const checkedBug: boolean | number = this.localService.VerifyAppPost();
      if (checkedBug == true) {
        //Verification preliminaire de l'existance de la bd
        const bdBugCrypt: any = localStorage.getItem('ECM_BB_0');
        if (bdBugCrypt == null) {
          this.errorNotifyService.notifyAlertErrorDefault(
            "D??soler ! Nous n'avons pas trouv?? de donn??es local sur les Posts ! Veiller reconfigur?? l'environnement local "
          );
          return false;
        }
        //Recuperation de la base
        let tbBugLocal: BugModel[] = [];
        for (let i = 0; i > -1; ++i) {
          let name: string = 'ECM_BB_' + i;
          let element: any = localStorage.getItem(name);
          if (element == null) {
            this.tbLocalBugService = tbBugLocal;
            this.updatetLocalbBugService();
            return true;
          }
          try {
            const elementDecrypt: string = window.atob(element);
            const elementDecryptParseJson: any = JSON.parse(elementDecrypt);

            tbBugLocal.push(elementDecryptParseJson);
            console.log('bon');
          } catch {
            console.log('error');
          }
        }
      }
    }
    return false;
  }
  //Methode pour le nombre d'elements sauvegard?? les donnees en local
  //TODO
  nbrElementDbBugCryptLocal(): number {
    //Verification preliminaire de l'existance de la bd
    let nbrElement: number = 0;
    if (localStorage.getItem('ECM_BB_0') == null) {
      return 0;
    }

    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BB_' + i;
      let element: any = localStorage.getItem(name);
      if (element != null) {
        nbrElement += 1;
      }
      if (element == null) {
        return nbrElement;
      }
    }

    return nbrElement;
  }
  //Methode pour supprimer les donnees en local
  //TODO
  deleteDbBugCryptLocal(silence: boolean): boolean {
    //Verification preliminaire de l'existance de la bd

    if (localStorage.getItem('ECM_BB_0') == null) {
      if (!silence) {
        this.errorNotifyService.notifyAlertErrorDefault(
          "Nous n'avons pas trouv?? de donn??es local a supprim??es sur les Posts ! "
        );
      }
      return false;
    }

    for (let i = 0; i > -1; ++i) {
      let name: string = 'ECM_BB_' + i;
      let element: any = localStorage.getItem(name);
      if (element != null) {
        localStorage.removeItem(name);
      }
      if (element == null) {
        if (!silence) {
          this.errorNotifyService.notifyAlertErrorDefault(
            'Donn??es local des Posts supprim??es ! '
          );
        }
        return true;
      }
    }

    return false;
  }

  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //...
}
