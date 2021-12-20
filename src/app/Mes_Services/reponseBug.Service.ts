import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ReponseBugModel } from '../Models/reponseBug';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from './notification.service';
import { GardGuard } from './gard.guard';
import { CommentaireModel } from '../Models/commentaire';
import { ErrorService } from './error.Service';
import * as moment from 'moment';
moment.locale('fr');
@Injectable()
export class ReponseBugService {
  user_Id_Connect: string;

  subscriptionEvent: Subscription = new Subscription();
  private tbReponseBug: ReponseBugModel[];
  public tbsubjectReponse: Subject<ReponseBugModel[]> = new Subject<
    ReponseBugModel[]
  >();
  constructor(
    private authService: GardGuard,
    private _snackBar: MatSnackBar,
    private notifyService: Notification,
    private alertErrorService: ErrorService
  ) {}

  //Methode Pour Les Notifications ...C'est un service..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //Emmission du tableau tbReponseBug avec le subject
  //TODO
  updateTbReponseBug() {
    this.tbsubjectReponse.next(this.tbReponseBug);
  }
  //.................................PARTIE METHODE ....................................
  //Creation new Reponse Bug
  //TODO
  creatNewReponseBug(
    bug_Id: string,
    reponse: string,
    user_Id_Bug: string,
    titre_Bug: string
  ) {
    //Recuperation de l' Id du user qui reponde ...
    //Recuperation du User_Id
    //todo
    this.user_Id_Connect = this.authService.user_Id_Connect;
    //Mise en place de ID de la reponse
    //Id de la reponse nous permet de bien identifier ,recuperé son index dans le tbReponse
    const id_Reponse = Date.now() + reponse.split(' ').join('%').substr(0, 5);
    //date
    let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
    //Mise en place new Reponse
    const newReponseBug = new ReponseBugModel(
      id_Reponse,
      bug_Id,
      this.user_Id_Connect,
      reponse,
      false,
      [new CommentaireModel('', '', '', '', '')],
      dateSaved
    );
    this.tbReponseBug.unshift(newReponseBug);
    this.sauvegardeBaseReponse();
    //Appelle du service de notification
    this.notifyService.notifyReponseBug(user_Id_Bug, titre_Bug);

    //this.updateTbReponseBug();
    const message = 'Merci ! Votre réponse a été bien enregistrée ...';
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }
  //Methode pour marquer la reponse Vu
  //TODO
  onViewReponse(Obj_Reponse: ReponseBugModel): boolean {
    let userIdRepondant = this.authService.user_Id_Connect;
    let userView: boolean = false;
    if (
      //verifi si le user n'a pas déja vue le post
      !Obj_Reponse.tbViewUser.includes(userIdRepondant)
    ) {
      userView = true;
      Obj_Reponse.tbViewUser.unshift(userIdRepondant);
      this.sauvegardeBaseReponse();
      this.updateTbReponseBug();
    }

    return userView;
  }
  //Methode pour marquer le commentiare Vu
  //TODO
  onViewUserCommentaire(Obj_Reponse: ReponseBugModel): boolean {
    this.user_Id_Connect = this.authService.user_Id_Connect;
    let userView: boolean = false;
    //On verifie si ne la pas en vue
    if (!Obj_Reponse.tbViewcommentaireUser.includes(this.user_Id_Connect)) {
      userView = true;
      Obj_Reponse.tbViewcommentaireUser.unshift(this.user_Id_Connect);
      this.sauvegardeBaseReponse();
      this.updateTbReponseBug();
    }
    return userView;
  }

  //Check d'un Commentaire a la  Reponse Bug
  //TODO
  onCheckReponseBug(obj_Reponse: ReponseBugModel): boolean {
    let isCheked: boolean = false;
    if (!obj_Reponse.isGood) {
      obj_Reponse.isGood = true;
      const message = 'Ravie ! que votre bug soit résolu ...';
      this.openSnackBar(message, 'ECM');
      isCheked = true;
    } else {
      obj_Reponse.isGood = false;
      const message =
        "Désolé ! que cette réponse n'a pas pu résoudre votre Bug ...";
      this.openSnackBar(message, 'ECM');
      isCheked = false;
    }
    this.sauvegardeBaseReponse();
    this.updateTbReponseBug();
    return isCheked;
  }
  //Ajout d'un Commentaire a la  Reponse Bug
  //TODO
  addCommentaireReponseBug(
    objReponse: ReponseBugModel,
    commentaire: string = '',
    nomUser: string | null,
    prenomUser: string | null,
    promoUser: string | null,
    fantomUser: string | null,
    id_User_Bug: string
  ): Promise<ReponseBugModel> {
    this.user_Id_Connect = this.authService.user_Id_Connect;
    return new Promise((resolve) => {
      //Verification si c'est donnee sont en locale av d'aller les cherché ds la Bd
      const objReponseReturn: ReponseBugModel = this.addCommentaireAfterVerify(
        objReponse,
        commentaire,
        nomUser,
        prenomUser,
        promoUser,
        fantomUser,
        id_User_Bug
      );
      // apres traitement on fait remonte l'objReponse dans le component a fin de le passer au service
      //component pour copier le tbCommentaire et savoir les concern3
      resolve(objReponseReturn);
    });
  }
  addCommentaireAfterVerify(
    objReponse: ReponseBugModel,
    commentaire: string,
    nomUser: string | null,
    prenomUser: string | null,
    promoUser: string | null,
    fantomUser: string | null,
    id_User_Bug: string
  ): ReponseBugModel {
    this.user_Id_Connect = this.authService.user_Id_Connect;
    if (
      nomUser != '' &&
      prenomUser != '' &&
      promoUser != '' &&
      fantomUser != '' &&
      this.user_Id_Connect
    ) {
      let dateSaved: string = moment().format('Do MMMM YYYY, HH:mm:ss');
      let userCommentaire: CommentaireModel;
      if (fantomUser == 'false') {
        userCommentaire = new CommentaireModel(
          commentaire,
          this.user_Id_Connect,
          nomUser,
          prenomUser,
          promoUser,
          dateSaved
        );
      } else {
        userCommentaire = new CommentaireModel(
          commentaire,
          this.user_Id_Connect
        );
      }
      objReponse.commentaire.unshift(userCommentaire);
      //Suppression de la valeure par defaut
      if (objReponse.commentaire[1].commentaire == '') {
        objReponse.commentaire.splice(1, 1);
      }
      //Appelle de notify pour notifier le user
      //recuperation des 10 premieres lettres de la reponse
      let debut_Reponse = objReponse.reponse.trim().substr(0, 10);
      //On verifi d'abord si ce user n'a deja pas commenter avant de l'ajouter
      //et id_User_Reponse proprietaire de la reponse est deja injecter par defaut
      if (!objReponse.tbcommentaireUser.includes(this.user_Id_Connect)) {
        objReponse.tbcommentaireUser.unshift(this.user_Id_Connect);
      }
      if (!objReponse.tbcommentaireUser.includes(id_User_Bug)) {
        objReponse.tbcommentaireUser.unshift(id_User_Bug);
      }
      //netoyage du tbView pour ReAlerté les concerné a nouveau
      objReponse.tbViewcommentaireUser = [''];
      //ajout du user qui a commenté car il ne sera op notifier de son commentaire
      objReponse.tbViewcommentaireUser.unshift(this.user_Id_Connect);
      this.sauvegardeBaseReponse();
      this.updateTbReponseBug();
      const message = 'Votre commentaire a été bien ajouté ...';
      this.openSnackBar(message, 'ECM');
      this.notifyService.notifyCommentaireReponseBug(
        debut_Reponse,
        objReponse.tbcommentaireUser
      );
    } else {
      this.alertErrorService.notifyAlertErrorDefault();
    }
    return objReponse;
  }
  //Suppression Commentaire
  //TODO
  deleteCommentaire(
    objReponse: ReponseBugModel,
    dateCommentaireDelete?: string
  ): boolean {
    //On verifier si cette action est bien declancher par le proprietaire du post
    let userIdRepondant = this.authService.user_Id_Connect;
    //on Verifie si c'est le dernier commentaire avant de le supprimer on ajout le commentaire par defaut
    if (objReponse.commentaire.length == 1) {
      objReponse.commentaire.unshift(
        new CommentaireModel('', '', '', '', '', '')
      );
    }
    //On recherche l'index du commentaire a supprimer
    //todo
    objReponse.commentaire.forEach((element) => {
      if (
        element.dateCommentaire == dateCommentaireDelete &&
        userIdRepondant == element.Id_User
      ) {
        const indexCommentaire = objReponse.commentaire.indexOf(element);
        objReponse.commentaire.splice(indexCommentaire, 1);
        const message = 'Votre commentaire a été bien supprimée ...';
        this.openSnackBar(message, 'ECM');
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
      } else {
        this.alertErrorService.notifyActionNonPermise('cet commentaire');
      }
    });
    return true;
  }
  //Suppression Reponse Bug
  //TODO
  DeleteReponseBug(objReponse: ReponseBugModel): boolean {
    //On verifier si cette action est bien declancher par le proprietaire de reponse
    let userIdRepondant = this.authService.user_Id_Connect;
    if (userIdRepondant !== objReponse.user_Id) {
      this.alertErrorService.notifyActionNonPermise('cette réponse');
      return false;
    }
    let trouver: boolean = false;
    //Voir commentaire dessus
    this.tbReponseBug.forEach((element) => {
      if (element.id_Reponse == objReponse.id_Reponse) {
        const index: number = this.tbReponseBug.indexOf(element);
        this.tbReponseBug.splice(index, 1);
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
        trouver = true;
        const message = 'Votre réponse a été bien supprimée ...';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      }
    });
    if (!trouver) {
      const message =
        "Une erreur inattendu ! l'or de la suppréssion de la réponse ! Veillez le signaler à ECM...";
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
    }
    return true;
  }
  //Suppression Reponse Bug l'or de la suppression d'un bug
  //TODO
  DeleteReponseBugDeleteBug(id_Bug: string): Promise<boolean> {
    //Voir commentaire dessus
    return new Promise((resolve, reject) => {
      try {
        let tbfilterReponse =
          this.tbReponseBug.filter(
            (ReponseBug: { bug_Id: string }) => ReponseBug.bug_Id !== id_Bug
          ).length !== 0
            ? this.tbReponseBug.filter(
                (ReponseBug: { bug_Id: string }) => ReponseBug.bug_Id !== id_Bug
              )
            : [];

        this.tbReponseBug = tbfilterReponse;
        resolve(true);
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
      } catch (error) {
        reject(false);
      }
    });
  }
  //...Partie de la suppression compte du User
  //TODO
  DeleteReponseBugUserDeleteCompte(id_User: string): Promise<number> {
    let nbrReponse: number = 0;
    return new Promise((resolve, rejects) => {
      try {
        let tbfilterReponse =
          this.tbReponseBug.filter(
            (ReponseBug: { user_Id: string | undefined }) =>
              ReponseBug.user_Id !== id_User
          ).length !== 0
            ? this.tbReponseBug.filter(
                (ReponseBug: { user_Id: string | undefined }) =>
                  ReponseBug.user_Id !== id_User
              )
            : [];
        nbrReponse = this.tbReponseBug.length - tbfilterReponse.length;
        this.tbReponseBug = tbfilterReponse;
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
        resolve(nbrReponse);
      } catch (error) {
        rejects(0);
      }
    });
  }
  //...Partie de la suppression ou reinitialisation compte du User
  //TODO
  DeleteCommentaireBugUserDeleteAndReiniCompte(
    id_User: string
  ): Promise<number> {
    let nbrCommentaire: number = 0;
    let tbFilterCommentaire: CommentaireModel[] = [];
    return new Promise((resolve, rejects) => {
      try {
        this.tbReponseBug.forEach((element) => {
          tbFilterCommentaire =
            element.commentaire.filter((element) => element.Id_User != id_User)
              .length != 0
              ? element.commentaire.filter(
                  (element) => element.Id_User != id_User
                )
              : [new CommentaireModel('', '', '', '', '', '')];

          if (
            tbFilterCommentaire.length == 1 &&
            tbFilterCommentaire[0].Id_User == ''
          ) {
            nbrCommentaire += element.commentaire.length;
          } else {
            nbrCommentaire +=
              element.commentaire.length - tbFilterCommentaire.length;
          }
          element.commentaire = tbFilterCommentaire;
          //Netoyage du tb avant de passer a un autre element
          tbFilterCommentaire = [];
        });

        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
        resolve(nbrCommentaire);
      } catch (error) {
        rejects(0);
      }
    });
  }
  //Verification du nombre de reponse
  //TODO
  verifyNbrReponse(id_Bug: string): number {
    //Mise en place de mon tb pour receuillir les reponses pour l'ID de ce Bug
    let tbFilterByIdBug: any[] = [];
    //Mise en place pour recuperer le nombre de reponses marquée merci
    let nbrReponse: number = 0;
    //Debut du filtre
    tbFilterByIdBug =
      this.tbReponseBug.filter(
        (reponse: { bug_Id: string }) => reponse.bug_Id == id_Bug
      ).length != 0
        ? this.tbReponseBug.filter(
            (reponse: { bug_Id: string }) => reponse.bug_Id == id_Bug
          )
        : [];

    nbrReponse = tbFilterByIdBug.length;
    //Renvoie du nbr de reponses
    return nbrReponse;
  }
  //Verification des reponses si au moin une a ete marque merci comme quoi que le bug
  //a etait resolu qui vas nous permettre de modifier l'etat du bug au niveau de ecm
  //TODO
  verifyCheckedReponse(id_Bug: string): number {
    //Mise en place de mon tb pour receuillir les reponses pour l'ID de ce Bug
    let tbFilterByIdBug: any[] = [];
    //Mise en place pour recuperer le nombre de reponses marquée merci
    let nbrReponseChecked: number = 0;
    //Debut du filtre
    tbFilterByIdBug =
      this.tbReponseBug.filter(
        (reponse: { bug_Id: string }) => reponse.bug_Id == id_Bug
      ).length != 0
        ? this.tbReponseBug.filter(
            (reponse: { bug_Id: string }) => reponse.bug_Id == id_Bug
          )
        : [];
    //Veification si au moins une de ces reponses a etait cochée bonne(Merci)
    if (tbFilterByIdBug.length > 0) {
      tbFilterByIdBug.forEach((reponse) => {
        if (reponse.isGood == true) {
          nbrReponseChecked += 1;
        }
      });
    }
    //Renvoie du nbr de reponses cheked
    return nbrReponseChecked;
  }
  //.................................PARTIE BASE DE DONNEE....................................

  //Enregistrement du tbReponseBug dans la base de donnee
  //TODO
  sauvegardeBaseReponse() {
    firebase
      .database()
      .ref('/dbReponse')
      .set(this.tbReponseBug, (error) => {
        if (error) {
          console.log('bd non atteint donnee sauvegarder en local ....ECM');
        } else {
          console.log('BaseReponse saved success ...ECM');
        }
      });
  }

  //Recuperation du tbReponseBug dans la base de donnee
  //TODO
  recupeBaseReponse() {
    firebase
      .database()
      .ref('/dbReponse')
      .on('value', (data_TbReponse) => {
        this.tbReponseBug = data_TbReponse.val() ? data_TbReponse.val() : [];
        this.updateTbReponseBug();
        console.log('Tb reponse from db Recuperé success ....ECM');
      });
  }
  //Recuperation solo du tbReponseBug dans la base de donnee
  //TODO
  recupeSoloBaseReponse(indice: number): Promise<ReponseBugModel> {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('/dbReponse/' + indice)
        .once('value')
        .then((data_Solo_reponse) => {
          resolve(data_Solo_reponse.val());
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
