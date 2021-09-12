import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ReponseBugModel } from '../Models/reponseBug';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReponseBugService {
  private tbReponseBug: ReponseBugModel[];
  public tbsubjectReponse: Subject<ReponseBugModel[]> = new Subject<
    ReponseBugModel[]
  >();
  constructor(private _snackBar: MatSnackBar) {}
  
  //....................
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
  creatNewReponseBug(bug_Id: string, reponse: string) {
    //Recuperation du user qui reponde ...
    const user_Id = firebase.auth().currentUser?.uid;
    //Mise en place de ID de la reponse
    //Id de la reponse nous permet de bien identifier ,recuperé son index dans le tbReponse
    const id_Reponse = Date.now() + reponse.split(' ').join('%').substr(0, 5);
    //Mise en place new Reponse
    const newReponseBug = new ReponseBugModel(
      id_Reponse,
      bug_Id,
      user_Id,
      reponse,
      false,
      ['pas de commentaire'],
      Date.now()
    );
    this.tbReponseBug.unshift(newReponseBug);
    this.sauvegardeBaseReponse();
    //this.updateTbReponseBug();
    const message = 'Merci ! Votre réponse a été bien enregistrée ...';
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
  }
  //Check d'un Commentaire a la  Reponse Bug
  //TODO
  onCheckReponseBug(id_Reponse: string): boolean {
    let isCheked: boolean = false;
    //Voir commentaire dessous
    this.tbReponseBug.forEach((element) => {
      if (element.id_Reponse == id_Reponse) {
        const index: number = this.tbReponseBug.indexOf(element);
        if (this.tbReponseBug[index].isGood == false) {
          this.tbReponseBug[index].isGood = true;
          this.sauvegardeBaseReponse();
          this.updateTbReponseBug();
          const message = 'Ravie ! que votre bug soit résolu ...';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          isCheked = true;
        } else {
          this.tbReponseBug[index].isGood = false;
          this.sauvegardeBaseReponse();
          this.updateTbReponseBug();
          const message =
            "Désolé ! que cette réponse n'a pas pu résoudre votre Bug ...";
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          isCheked = false;
        }
      }
    });
    return isCheked;
  }
  //Ajout d'un Commentaire a la  Reponse Bug
  //TODO
  addCommentaireReponseBug(id_Reponse: string, commentaire: string = '') {
    //Mise en place de la boucle foreach
    /*
  La boucle foreach nous permet de selectionne l'element suivant par Id pour de qu'il soit
  identifier qu'on puisse recupere sont index afin qu'on puisse ajouter le commentaire
  ................Pourquoi tout cela .............
  parce notre tb au niveau de la vue elle a etait filtre donc leurs indice on etaient
  changer alors on poura plus nous base de ce indice pour faire les modification
  
  */

    this.tbReponseBug.forEach((element) => {
      if (element.id_Reponse == id_Reponse) {
        const index: number = this.tbReponseBug.indexOf(element);
        this.tbReponseBug[index].commentaire.unshift(commentaire);
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
        const message = 'Votre commentaire a été bien ajouté ...';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      }
    });
  }
  //Suppression Reponse Bug
  //TODO
  DeleteReponseBug(id_Reponse: string) {
    //Voir commentaire dessus
    this.tbReponseBug.forEach((element) => {
      if (element.id_Reponse == id_Reponse) {
        const index: number = this.tbReponseBug.indexOf(element);
        this.tbReponseBug.splice(index, 1);
        this.sauvegardeBaseReponse();
        this.updateTbReponseBug();
        const message = 'Votre réponse a été bien supprimée ...';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      } else {
      }
    });
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
      tbFilterByIdBug.forEach((element) => {
        if (element.isGood == true) {
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
